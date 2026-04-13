'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import { entities, relationships, formatAmount } from '@/lib/data';

interface SankeyNodeExtra {
  id: string;
  name: string;
  entityType: string;
}

interface SankeyLinkExtra {
  amount_cents: number;
  description: string;
}

type SNode = SankeyNode<SankeyNodeExtra, SankeyLinkExtra>;
type SLink = SankeyLink<SankeyNodeExtra, SankeyLinkExtra>;

function buildSankeyData() {
  // Only financial relationships with actual dollar amounts
  const financialRels = relationships.filter(
    (r) => r.type === 'financial' && r.amount_cents && r.amount_cents > 0
  );

  // Build unique node set from financial relationships
  const nodeIds = new Set<string>();
  for (const rel of financialRels) {
    nodeIds.add(rel.source_id);
    nodeIds.add(rel.target_id);
  }

  const entityMap = new Map(entities.map((e) => [e.id, e]));
  const nodeArray = Array.from(nodeIds);
  const nodeIndexMap = new Map(nodeArray.map((id, i) => [id, i]));

  const nodes: SankeyNodeExtra[] = nodeArray.map((id) => {
    const entity = entityMap.get(id);
    return {
      id,
      name: entity?.name ?? id,
      entityType: entity?.type ?? 'unknown',
    };
  });

  // d3-sankey doesn't allow cycles. Some relationships form cycles
  // (e.g., Sun -> WLF and WLF -> TRON). We need to detect and break them.
  // Build an adjacency list and do a simple DFS cycle check.
  const adj = new Map<string, Set<string>>();
  const links: Array<{ source: string; target: string; value: number; amount_cents: number; description: string }> = [];

  for (const rel of financialRels) {
    const srcId = rel.source_id;
    const tgtId = rel.target_id;

    if (srcId === tgtId) continue; // skip self-loops

    // Check if adding this edge creates a cycle using simple path check
    if (wouldCreateCycle(adj, srcId, tgtId)) continue;

    if (!adj.has(srcId)) adj.set(srcId, new Set());
    adj.get(srcId)!.add(tgtId);

    links.push({
      source: srcId,
      target: tgtId,
      value: rel.amount_cents! / 100, // convert to dollars for sizing
      amount_cents: rel.amount_cents!,
      description: rel.description,
    });
  }

  return { nodes, links };
}

function wouldCreateCycle(
  adj: Map<string, Set<string>>,
  from: string,
  to: string
): boolean {
  // Would adding edge from->to create a cycle?
  // Check if there's already a path from 'to' to 'from'
  const visited = new Set<string>();
  const queue = [to];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === from) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const neighbors = adj.get(current);
    if (neighbors) {
      for (const n of neighbors) {
        queue.push(n);
      }
    }
  }
  return false;
}

export default function SankeyDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const renderSankey = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || dimensions.width === 0 || dimensions.height === 0) return;

    const { nodes, links } = buildSankeyData();
    if (nodes.length === 0 || links.length === 0) return;

    const margin = { top: 20, right: 180, bottom: 20, left: 180 };
    const width = dimensions.width;
    const height = dimensions.height;

    // Clear previous render
    d3.select(svg).selectAll('*').remove();

    const svgSel = d3
      .select(svg)
      .attr('width', width)
      .attr('height', height);

    const sankeyGenerator = sankey<SankeyNodeExtra, SankeyLinkExtra>()
      .nodeId((d) => d.id)
      .nodeWidth(20)
      .nodePadding(16)
      .nodeAlign((node: SNode) => {
        // Manual alignment for story clarity
        // Sources on left, WLF in center, recipients on right
        const id = node.id;
        if (id === 'o-wlf') return 1; // center
        // Money flowing INTO wlf
        if (['e-tahnoun', 'o-mgx', 'e-sun', 'o-fff'].includes(id)) return 0;
        // Money flowing OUT of wlf
        if (['e-donald-trump', 'o-dolomite', 'e-herro', 'e-folkman', 'o-tron'].includes(id)) return 2;
        // Witkoff network
        if (['o-witkoff-group', 'c-qatar', 'e-steve-witkoff', 'c-uae'].includes(id)) return 2;
        return 1;
      })
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    const sankeyData = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    });

    const sankeyNodes = sankeyData.nodes as SNode[];
    const sankeyLinks = sankeyData.links as SLink[];

    // Color scale for flows — red tones for corruption money
    const colorScale = d3
      .scaleLog()
      .domain([
        d3.min(sankeyLinks, (d) => (d as unknown as { amount_cents: number }).amount_cents) || 1,
        d3.max(sankeyLinks, (d) => (d as unknown as { amount_cents: number }).amount_cents) || 1,
      ])
      .range([0.3, 1] as unknown as [number, number]);

    // Gradient definitions for links
    const defs = svgSel.append('defs');

    // Glow filter
    const filter = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Links
    const linkGroup = svgSel
      .append('g')
      .attr('class', 'links')
      .attr('fill', 'none');

    const linkPaths = linkGroup
      .selectAll('path')
      .data(sankeyLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d) => {
        const intensity = colorScale(
          (d as unknown as { amount_cents: number }).amount_cents
        ) as number;
        return d3.interpolate('#7f1d1d', '#ef4444')(intensity);
      })
      .attr('stroke-width', (d) => Math.max(2, d.width || 1))
      .attr('stroke-opacity', (d) => {
        if (!selectedNode) return 0.6;
        const sourceId = (d.source as SNode).id;
        const targetId = (d.target as SNode).id;
        return sourceId === selectedNode || targetId === selectedNode
          ? 0.85
          : 0.08;
      })
      .style('mix-blend-mode', 'screen')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .attr('stroke-opacity', 0.9)
          .attr('filter', 'url(#glow)');
        const amount = (d as unknown as { amount_cents: number }).amount_cents;
        const desc = (d as unknown as { description: string }).description;
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            content: `${formatAmount(amount)}\n${desc}`,
          });
        }
      })
      .on('mouseleave', function () {
        d3.select(this)
          .attr('stroke-opacity', selectedNode ? 0.08 : 0.6)
          .attr('filter', null);
        setTooltip(null);
      });

    // Nodes
    const nodeGroup = svgSel.append('g').attr('class', 'nodes');

    const nodeRects = nodeGroup
      .selectAll('rect')
      .data(sankeyNodes)
      .join('rect')
      .attr('x', (d) => d.x0!)
      .attr('y', (d) => d.y0!)
      .attr('width', (d) => (d.x1! - d.x0!))
      .attr('height', (d) => Math.max(1, d.y1! - d.y0!))
      .attr('fill', (d) => {
        if (d.id === 'o-wlf') return '#d97706'; // amber for WLF
        if (d.entityType === 'person') return '#f97316'; // orange
        if (d.entityType === 'country') return '#a855f7'; // purple
        return '#06b6d4'; // cyan for orgs/companies
      })
      .attr('opacity', (d) => {
        if (!selectedNode) return 0.9;
        if (d.id === selectedNode) return 1;
        // Check if connected to selected
        const connected = sankeyLinks.some(
          (l) =>
            ((l.source as SNode).id === selectedNode &&
              (l.target as SNode).id === d.id) ||
            ((l.target as SNode).id === selectedNode &&
              (l.source as SNode).id === d.id)
        );
        return connected ? 0.9 : 0.15;
      })
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('click', function (_, d) {
        setSelectedNode((prev) => (prev === d.id ? null : d.id));
      })
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('filter', 'url(#glow)');
        const totalIn = sankeyLinks
          .filter((l) => (l.target as SNode).id === d.id)
          .reduce((s, l) => s + (l as unknown as { amount_cents: number }).amount_cents, 0);
        const totalOut = sankeyLinks
          .filter((l) => (l.source as SNode).id === d.id)
          .reduce((s, l) => s + (l as unknown as { amount_cents: number }).amount_cents, 0);
        const parts = [d.name];
        if (totalIn > 0) parts.push(`In: ${formatAmount(totalIn)}`);
        if (totalOut > 0) parts.push(`Out: ${formatAmount(totalOut)}`);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            content: parts.join('\n'),
          });
        }
      })
      .on('mouseleave', function () {
        d3.select(this).attr('filter', null);
        setTooltip(null);
      });

    // Node labels
    nodeGroup
      .selectAll('text.node-label')
      .data(sankeyNodes)
      .join('text')
      .attr('class', 'node-label')
      .attr('x', (d) => {
        // Labels on the outside of nodes
        const midX = (d.x0! + d.x1!) / 2;
        if (midX < width / 2) return d.x0! - 8;
        return d.x1! + 8;
      })
      .attr('y', (d) => (d.y0! + d.y1!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => {
        const midX = (d.x0! + d.x1!) / 2;
        return midX < width / 2 ? 'end' : 'start';
      })
      .attr('fill', (d) => {
        if (!selectedNode) return '#e5e7eb';
        if (d.id === selectedNode) return '#ffffff';
        const connected = sankeyLinks.some(
          (l) =>
            ((l.source as SNode).id === selectedNode &&
              (l.target as SNode).id === d.id) ||
            ((l.target as SNode).id === selectedNode &&
              (l.source as SNode).id === d.id)
        );
        return connected ? '#e5e7eb' : '#4b5563';
      })
      .attr('font-size', (d) => {
        const nodeHeight = d.y1! - d.y0!;
        return nodeHeight > 40 ? '13px' : '11px';
      })
      .attr('font-weight', (d) => (d.id === 'o-wlf' ? 'bold' : 'normal'))
      .text((d) => d.name);

    // Link amount labels (for large flows)
    const linkLabels = svgSel.append('g').attr('class', 'link-labels');

    linkLabels
      .selectAll('text')
      .data(sankeyLinks.filter((d) => (d.width || 0) > 8))
      .join('text')
      .attr('x', (d) => {
        const sx = (d.source as SNode).x1!;
        const tx = (d.target as SNode).x0!;
        return (sx + tx) / 2;
      })
      .attr('y', (d) => {
        return (d.y0! + d.y1!) / 2;
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => {
        if (!selectedNode) return '#fca5a5';
        const sourceId = (d.source as SNode).id;
        const targetId = (d.target as SNode).id;
        return sourceId === selectedNode || targetId === selectedNode
          ? '#fca5a5'
          : '#374151';
      })
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text((d) =>
        formatAmount((d as unknown as { amount_cents: number }).amount_cents)
      );

    // Update on selection change — re-run opacities
    if (selectedNode !== null) {
      linkPaths.attr('stroke-opacity', (d) => {
        const sourceId = (d.source as SNode).id;
        const targetId = (d.target as SNode).id;
        return sourceId === selectedNode || targetId === selectedNode
          ? 0.85
          : 0.08;
      });
    }
  }, [dimensions, selectedNode]);

  useEffect(() => {
    renderSankey();
  }, [renderSankey]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 bg-gray-900/95 border border-red-900/50 rounded-lg px-3 py-2 text-sm max-w-xs"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 12,
            transform: 'translateY(-100%)',
          }}
        >
          {tooltip.content.split('\n').map((line, i) => (
            <div
              key={i}
              className={i === 0 ? 'text-white font-semibold' : 'text-gray-400 text-xs mt-0.5'}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Selection indicator */}
      {selectedNode && (
        <button
          onClick={() => setSelectedNode(null)}
          className="absolute top-4 right-4 z-40 bg-gray-800/90 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
        >
          Clear selection
        </button>
      )}
    </div>
  );
}
