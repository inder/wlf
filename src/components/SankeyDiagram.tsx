'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import { formatAmount } from '@/lib/data';

interface SankeyNodeExtra {
  id: string;
  name: string;
  entityType: string;
  column: number;
}

interface SankeyLinkExtra {
  amount_cents: number;
  description: string;
}

type SNode = SankeyNode<SankeyNodeExtra, SankeyLinkExtra>;
type SLink = SankeyLink<SankeyNodeExtra, SankeyLinkExtra>;

// Hand-curated flows for a clean Sankey story:
// Left column: money sources flowing INTO WLF
// Center: WLF
// Right column: money flowing OUT of WLF / recipients
const CURATED_FLOWS: Array<{
  source: string;
  sourceName: string;
  sourceType: string;
  target: string;
  targetName: string;
  targetType: string;
  amount_cents: number;
  description: string;
}> = [
  // Money IN to WLF
  {
    source: 'tahnoun', sourceName: 'Sheikh Tahnoun (UAE)', sourceType: 'person',
    target: 'wlf', targetName: 'World Liberty Financial', targetType: 'organization',
    amount_cents: 50_000_000_000, description: 'Secret 49% stake via Aryam Investment',
  },
  {
    source: 'mgx', sourceName: 'MGX (Abu Dhabi)', sourceType: 'company',
    target: 'wlf', targetName: 'World Liberty Financial', targetType: 'organization',
    amount_cents: 200_000_000_000, description: '$2B in USD1 stablecoin for Binance deal',
  },
  {
    source: 'fff', sourceName: '$TRUMP Memecoin', sourceType: 'company',
    target: 'wlf', targetName: 'World Liberty Financial', targetType: 'organization',
    amount_cents: 35_000_000_000, description: '$350M in memecoin fees',
  },
  {
    source: 'sun', sourceName: 'Justin Sun', sourceType: 'person',
    target: 'wlf', targetName: 'World Liberty Financial', targetType: 'organization',
    amount_cents: 7_500_000_000, description: 'Largest external investor, $75M+ in WLFI tokens',
  },
  // Money OUT of WLF
  {
    source: 'wlf', sourceName: 'World Liberty Financial', sourceType: 'organization',
    target: 'trump-family', targetName: 'Trump Family', targetType: 'person',
    amount_cents: 18_700_000_000, description: '$187M from Tahnoun stake paid to Trump entities',
  },
  {
    source: 'wlf', sourceName: 'World Liberty Financial', sourceType: 'organization',
    target: 'herro-folkman', targetName: 'Herro & Folkman', targetType: 'person',
    amount_cents: 6_500_000_000, description: 'Co-founders collected $65M from WLF',
  },
  {
    source: 'wlf', sourceName: 'World Liberty Financial', sourceType: 'organization',
    target: 'dolomite', targetName: 'Dolomite (CTO)', targetType: 'company',
    amount_cents: 7_500_000_000, description: 'CTO borrowed $75M from his own protocol',
  },
  {
    source: 'wlf', sourceName: 'World Liberty Financial', sourceType: 'organization',
    target: 'witkoff', targetName: 'Witkoff Entities', targetType: 'person',
    amount_cents: 3_100_000_000, description: '$31M+ to Witkoff-connected entities from Tahnoun deal',
  },
  // Witkoff side deal (column 2 → 3)
  {
    source: 'witkoff', sourceName: 'Witkoff Entities', sourceType: 'person',
    target: 'qatar', targetName: 'Qatar', targetType: 'country',
    amount_cents: 62_300_000_000, description: 'Sold Park Lane Hotel to Qatari Investment Authority',
  },
];

// Column assignments: 0=left (sources), 1=center (WLF), 2=right (recipients), 3=far right
const COLUMN_MAP: Record<string, number> = {
  tahnoun: 0,
  mgx: 0,
  fff: 0,
  sun: 0,
  wlf: 1,
  'trump-family': 2,
  'herro-folkman': 2,
  dolomite: 2,
  witkoff: 2,
  qatar: 3,
};

function buildSankeyData() {
  const nodeMap = new Map<string, SankeyNodeExtra>();
  const links: Array<{ source: string; target: string; value: number; amount_cents: number; description: string }> = [];

  for (const flow of CURATED_FLOWS) {
    if (!nodeMap.has(flow.source)) {
      nodeMap.set(flow.source, {
        id: flow.source,
        name: flow.sourceName,
        entityType: flow.sourceType,
        column: COLUMN_MAP[flow.source] ?? 0,
      });
    }
    if (!nodeMap.has(flow.target)) {
      nodeMap.set(flow.target, {
        id: flow.target,
        name: flow.targetName,
        entityType: flow.targetType,
        column: COLUMN_MAP[flow.target] ?? 2,
      });
    }

    // Use sqrt compression so $2B doesn't dwarf $31M
    // Without this, $2B is 65x thicker than $31M — unreadable
    const compressed = Math.sqrt(flow.amount_cents / 100);

    links.push({
      source: flow.source,
      target: flow.target,
      value: compressed,
      amount_cents: flow.amount_cents,
      description: flow.description,
    });
  }

  return { nodes: Array.from(nodeMap.values()), links };
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

    const margin = { top: 30, right: 160, bottom: 30, left: 160 };
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
      .nodeWidth(24)
      .nodePadding(28)
      .nodeAlign((node: SNode) => node.column)
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

    // Color scale for flows — red tones
    const colorScale = d3
      .scaleLog()
      .domain([
        d3.min(sankeyLinks, (d) => (d as unknown as { amount_cents: number }).amount_cents) || 1,
        d3.max(sankeyLinks, (d) => (d as unknown as { amount_cents: number }).amount_cents) || 1,
      ])
      .range([0.3, 1] as unknown as [number, number]);

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
      .attr('stroke-width', (d) => Math.max(3, d.width || 1))
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

    nodeGroup
      .selectAll('rect')
      .data(sankeyNodes)
      .join('rect')
      .attr('x', (d) => d.x0!)
      .attr('y', (d) => d.y0!)
      .attr('width', (d) => (d.x1! - d.x0!))
      .attr('height', (d) => Math.max(4, d.y1! - d.y0!))
      .attr('fill', (d) => {
        if (d.id === 'wlf') return '#d97706';
        if (d.entityType === 'person') return '#f97316';
        if (d.entityType === 'country') return '#a855f7';
        return '#06b6d4';
      })
      .attr('opacity', (d) => {
        if (!selectedNode) return 0.9;
        if (d.id === selectedNode) return 1;
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
        if (d.column <= 1) return d.x0! - 10;
        return d.x1! + 10;
      })
      .attr('y', (d) => (d.y0! + d.y1!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => d.column <= 1 ? 'end' : 'start')
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
      .attr('font-size', (d) => d.id === 'wlf' ? '15px' : '13px')
      .attr('font-weight', (d) => d.id === 'wlf' ? 'bold' : 'normal')
      .text((d) => d.name);

    // Amount labels on flows
    const linkLabels = svgSel.append('g').attr('class', 'link-labels');

    linkLabels
      .selectAll('text')
      .data(sankeyLinks)
      .join('text')
      .attr('x', (d) => {
        const sx = (d.source as SNode).x1!;
        const tx = (d.target as SNode).x0!;
        return (sx + tx) / 2;
      })
      .attr('y', (d) => (d.y0! + d.y1!) / 2)
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
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text((d) =>
        formatAmount((d as unknown as { amount_cents: number }).amount_cents)
      );

    // Update on selection change
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
