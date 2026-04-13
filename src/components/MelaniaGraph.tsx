'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';
import type { GraphNode, GraphLink, EntityType, RelationType } from '@/lib/types';
import { RELATION_TO_VISUAL, VISUAL_COLORS } from '@/lib/types';
import { formatAmount, bfsReachable } from '@/lib/data';
import melaniaEntities from '@/data/melania-entities.json';
import melaniaRelationships from '@/data/melania-relationships.json';

const NODE_COLORS: Record<EntityType, string> = {
  person: '#f97316',
  country: '#8b5cf6',
  organization: '#06b6d4',
  company: '#64748b',
  government_body: '#8b5cf6',
  pac: '#ec4899',
};

// Bridge entity IDs that link to the main investigation
const BRIDGE_IDS = new Set(['e-zanker', 'o-fff', 'o-wlf', 'e-donald-trump']);

const HIGHLIGHT_EDGE_COLORS: Record<string, string> = {
  money: '#ff6b6b',
  power: '#60a5fa',
  personal: '#4ade80',
};

function getImpactRadius(nodeId: string): number {
  if (nodeId === 'm-melania-token') return 42;
  if (nodeId === 'm-melania-trump') return 34;
  if (nodeId === 'e-donald-trump') return 30;
  if (BRIDGE_IDS.has(nodeId)) return 22;
  return 24;
}

function buildGraphData(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = melaniaEntities.map((e: any) => ({
    id: e.id,
    slug: e.slug,
    name: e.name,
    type: e.type as EntityType,
    role: e.role,
    one_liner: e.one_liner || e.bio?.slice(0, 80) || '',
    photo_url: e.photo_url ?? undefined,
  }));

  const links: GraphLink[] = melaniaRelationships.map((r: any) => ({
    source: r.source_id,
    target: r.target_id,
    type: r.type as RelationType,
    claim_type: r.claim_type,
    description: r.description,
    amount_cents: r.amount_cents,
  }));

  return { nodes, links };
}

export default function MelaniaGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const [selectedNodeId, setSelectedNode] = useState<string | null>(null);
  const router = useRouter();

  const nodeGroupRef = useRef<d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null>(null);
  const linkGroupRef = useRef<d3.Selection<SVGLineElement, GraphLink, SVGGElement, unknown> | null>(null);
  const currentLinksRef = useRef<GraphLink[]>([]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const { nodes, links } = buildGraphData();
    currentLinksRef.current = links;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    // Melania pink gradient for center node
    const melaniaGradient = defs.append('radialGradient').attr('id', 'melania-gradient');
    melaniaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#f472b6');
    melaniaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#be185d');

    // Glow
    const glow = defs.append('filter').attr('id', 'glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers
    for (const [cat, color] of Object.entries(VISUAL_COLORS)) {
      defs.append('marker')
        .attr('id', `marrow-${cat}`)
        .attr('viewBox', '0 0 10 6')
        .attr('refX', 10)
        .attr('refY', 3)
        .attr('markerWidth', 8)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,0 L10,3 L0,6 Z')
        .attr('fill', color)
        .attr('fill-opacity', 0.6);
    }

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.attr('width', width).attr('height', height)
      .call(zoom)
      .on('click', () => setSelectedNode(null));

    // Links
    const linkGroup = g.append('g').attr('class', 'links')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => VISUAL_COLORS[RELATION_TO_VISUAL[d.type]])
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', (d) => {
        if (!d.amount_cents) return 1.5;
        const dollars = d.amount_cents / 100;
        if (dollars >= 100_000_000) return 5;
        if (dollars >= 10_000_000) return 3;
        return 2;
      })
      .attr('marker-end', (d) => `url(#marrow-${RELATION_TO_VISUAL[d.type]})`);

    linkGroupRef.current = linkGroup;

    // Edge labels
    const edgeLabels = g.append('g').attr('class', 'edge-labels')
      .selectAll<SVGTextElement, GraphLink>('text')
      .data(links)
      .join('text')
      .attr('font-size', 9)
      .attr('fill', '#6b7280')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text((d) => {
        if (d.amount_cents) return '';
        const typeLabels: Record<RelationType, string> = {
          financial: '', political: 'Political', familial: 'Family',
          advisory: 'Advisor', employment: '', lobbying: 'Lobbying',
          diplomatic: 'Envoy', criminal: 'Criminal',
        };
        return typeLabels[d.type] || '';
      });

    // Amount labels
    const moneyLinks = links.filter((d) => d.amount_cents && d.amount_cents >= 100000000);
    const amountLabels = g.append('g').attr('class', 'amount-labels')
      .selectAll<SVGGElement, GraphLink>('g')
      .data(moneyLinks)
      .join('g');

    amountLabels.append('rect')
      .attr('fill', 'rgba(0,0,0,0.8)')
      .attr('rx', 4).attr('ry', 4)
      .attr('x', -32).attr('y', -11)
      .attr('width', 64).attr('height', 22);

    amountLabels.append('text')
      .attr('font-size', 13)
      .attr('font-weight', '800')
      .attr('fill', '#ef4444')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('pointer-events', 'none')
      .text((d) => d.amount_cents ? formatAmount(d.amount_cents) : '');

    // Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        // Bridge nodes navigate to main investigation
        if (BRIDGE_IDS.has(d.id) && d.id !== 'e-donald-trump') {
          if (d.type === 'person') router.push(`/person/${d.slug}`);
          else router.push(`/org/${d.slug}`);
          return;
        }
        setSelectedNode((prev) => (prev === d.id ? null : d.id));
      });

    nodeGroupRef.current = nodeGroup;

    // Node circles
    nodeGroup.append('circle')
      .attr('r', (d) => getImpactRadius(d.id))
      .attr('fill', (d) => {
        if (d.id === 'm-melania-token') return 'url(#melania-gradient)';
        if (BRIDGE_IDS.has(d.id)) return NODE_COLORS[d.type] || '#64748b';
        return NODE_COLORS[d.type] || '#64748b';
      })
      .attr('stroke', (d) => BRIDGE_IDS.has(d.id) ? '#fbbf24' : 'rgba(255,255,255,0.15)')
      .attr('stroke-width', (d) => BRIDGE_IDS.has(d.id) ? 2 : 1)
      .attr('stroke-dasharray', (d) => BRIDGE_IDS.has(d.id) ? '4,3' : 'none')
      .attr('class', 'node-circle');

    // Center symbol for $MELANIA token
    nodeGroup.filter((d) => d.id === 'm-melania-token')
      .append('text')
      .attr('text-anchor', 'middle').attr('dy', 2)
      .attr('fill', '#fff').attr('font-size', 22).attr('font-weight', '900')
      .text('$M');

    // Photos for people with photo_url
    const photoPeople = nodes.filter(n => n.type === 'person' && n.photo_url);
    for (const person of photoPeople) {
      const r = getImpactRadius(person.id);
      const clipId = `mclip-${person.id}`;
      defs.append('clipPath').attr('id', clipId)
        .append('circle').attr('r', r);

      nodeGroup.filter((d) => d.id === person.id)
        .append('image')
        .attr('href', person.photo_url!)
        .attr('x', -r).attr('y', -r)
        .attr('width', r * 2).attr('height', r * 2)
        .attr('clip-path', `url(#${clipId})`)
        .attr('preserveAspectRatio', 'xMidYMid slice');
    }

    // Initials for people without photos
    nodeGroup.filter((d) => d.type === 'person' && !d.photo_url && d.id !== 'm-melania-token')
      .append('text')
      .attr('text-anchor', 'middle').attr('dy', 5)
      .attr('fill', '#fff')
      .attr('font-size', (d) => Math.max(10, getImpactRadius(d.id) * 0.45))
      .attr('font-weight', '700')
      .text((d) => {
        const parts = d.name.split(' ');
        return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '');
      });

    // Letters for orgs/companies
    nodeGroup.filter((d) => d.type !== 'person' && d.id !== 'm-melania-token')
      .append('text')
      .attr('text-anchor', 'middle').attr('dy', 4)
      .attr('fill', '#fff').attr('font-size', 10)
      .text((d) => d.type === 'organization' ? 'O' : 'C');

    // Node labels
    nodeGroup.append('text')
      .attr('dy', (d) => getImpactRadius(d.id) + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => BRIDGE_IDS.has(d.id) ? '#fbbf24' : '#d1d5db')
      .attr('font-size', (d) => d.id === 'm-melania-token' ? 14 : 12)
      .attr('font-weight', (d) => d.id === 'm-melania-token' || d.id === 'm-melania-trump' ? '700' : '500')
      .text((d) => d.name);

    // "Main Investigation" sub-label for bridge nodes
    nodeGroup.filter((d) => BRIDGE_IDS.has(d.id))
      .append('text')
      .attr('dy', (d) => getImpactRadius(d.id) + 28)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fbbf24')
      .attr('font-size', 9)
      .attr('font-style', 'italic')
      .text('(Main Investigation)');

    // Drag
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on('end', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        d.fx = null; d.fy = null;
      });

    nodeGroup.call(drag);

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(130))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => getImpactRadius(d.id) + 20))
      .alphaDecay(0.025)
      .on('tick', () => {
        linkGroup
          .attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
        edgeLabels
          .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
          .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 6);
        amountLabels
          .attr('transform', (d: any) => `translate(${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2})`);
        nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    simulationRef.current = simulation;
    return () => { simulation.stop(); };
  }, [router]);

  // Selection highlighting
  useEffect(() => {
    const nodeGroup = nodeGroupRef.current;
    const linkGroup = linkGroupRef.current;
    const links = currentLinksRef.current;
    if (!nodeGroup || !linkGroup) return;

    if (!selectedNodeId) {
      nodeGroup.attr('opacity', 1);
      nodeGroup.selectAll('.node-circle')
        .attr('filter', null);
      linkGroup.attr('stroke-opacity', 0.5);
      return;
    }

    const reachable = bfsReachable(selectedNodeId, links);

    linkGroup.attr('stroke-opacity', (d: any) => {
      const srcId = typeof d.source === 'string' ? d.source : d.source.id;
      const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
      return reachable.has(srcId) && reachable.has(tgtId) ? 0.9 : 0.06;
    });

    nodeGroup.attr('opacity', (d: any) => reachable.has(d.id) ? 1 : 0.1);
    nodeGroup.selectAll('.node-circle')
      .attr('filter', (d: any) => d.id === selectedNodeId ? 'url(#glow)' : null);
  }, [selectedNodeId]);

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-950 relative">
      <svg ref={svgRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-30 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
        <div className="flex gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-500" />
            $MELANIA
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            Person
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-500" />
            Company
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-dashed border-yellow-500" style={{ background: 'transparent' }} />
            Main Investigation
          </div>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">
          Click: highlight | Dashed border: links to main investigation | Drag: move
        </p>
      </div>

      {selectedNodeId && (
        <button
          onClick={() => setSelectedNode(null)}
          className="absolute top-4 right-4 z-40 bg-gray-800/90 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors"
        >
          Clear selection
        </button>
      )}
    </div>
  );
}
