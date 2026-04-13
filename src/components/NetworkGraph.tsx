'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink, EntityType, RelationType } from '@/lib/types';
import { RELATION_TO_VISUAL, VISUAL_COLORS, COUNTRY_FLAGS, ALL_FILTER_TYPES } from '@/lib/types';
import { useGraphStore } from '@/store/graph-store';
import { getFilteredGraphData, formatAmount, computeImpactScores, bfsReachable, bfsReachableNHops } from '@/lib/data';

const NODE_COLORS: Record<EntityType, string> = {
  person: '#f97316',
  country: '#8b5cf6',
  organization: '#06b6d4',
  company: '#64748b',
  government_body: '#8b5cf6',
  pac: '#ec4899',
};

const HIGHLIGHT_EDGE_COLORS: Record<string, string> = {
  money: '#ff6b6b',
  power: '#60a5fa',
  personal: '#4ade80',
};

function getNodeLabel(node: GraphNode): string {
  if (node.type === 'country') return node.name;
  if (node.id === 'o-wlf') return 'World Liberty Financial';
  const parts = node.name.split(' ');
  if (parts.length <= 2) return node.name;
  return parts[0] + ' ' + parts[parts.length - 1];
}

function getEdgeLabel(link: GraphLink): string {
  if (link.amount_cents) return formatAmount(link.amount_cents);
  const desc = link.description;
  if (desc.length <= 35) return desc;
  return desc.slice(0, 32) + '...';
}

function getImpactRadius(score: number, nodeId: string): number {
  if (nodeId === 'o-wlf') return 48;
  if (nodeId === 'e-donald-trump') return 36;
  const min = 14;
  const max = 32;
  const normalized = Math.min(score / 12, 1);
  return min + normalized * (max - min);
}

export default function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Refs for D3 selections (so we can update visuals without rebuilding)
  const nodeGroupRef = useRef<d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null>(null);
  const linkGroupRef = useRef<d3.Selection<SVGLineElement, GraphLink, SVGGElement, unknown> | null>(null);
  const edgeLabelGroupRef = useRef<d3.Selection<SVGTextElement, GraphLink, SVGGElement, unknown> | null>(null);
  const amountLabelGroupRef = useRef<d3.Selection<SVGGElement, GraphLink, SVGGElement, unknown> | null>(null);
  const currentLinksRef = useRef<GraphLink[]>([]);

  const { selectedNodeId, focusedNodeId, activeFilters, selectNode, focusNode } = useGraphStore();

  const handleNodeClick = useCallback(
    (event: MouseEvent, d: GraphNode) => {
      event.stopPropagation();
      selectNode(d.id);
    },
    [selectNode]
  );

  const handleNodeDblClick = useCallback(
    (event: MouseEvent, d: GraphNode) => {
      event.stopPropagation();
      focusNode(focusedNodeId === d.id ? null : d.id);
    },
    [focusNode, focusedNodeId]
  );

  // Main simulation effect — only rebuilds when filters or focus changes
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    let { nodes, links } = getFilteredGraphData(activeFilters);

    // Focus mode: filter to 2-hop neighborhood of focused node
    if (focusedNodeId) {
      const reachable = bfsReachableNHops(focusedNodeId, links, 2);
      nodes = nodes.filter(n => reachable.has(n.id));
      links = links.filter(l => {
        const srcId = typeof l.source === 'string' ? l.source : l.source.id;
        const tgtId = typeof l.target === 'string' ? l.target : l.target.id;
        return reachable.has(srcId) && reachable.has(tgtId);
      });
    }

    // Compute impact scores for sizing
    const impactScores = computeImpactScores(links);

    currentLinksRef.current = links;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for patterns (photos, gradients)
    const defs = svg.append('defs');

    // WLF gold gradient
    const wlfGradient = defs.append('radialGradient').attr('id', 'wlf-gradient');
    wlfGradient.append('stop').attr('offset', '0%').attr('stop-color', '#fbbf24');
    wlfGradient.append('stop').attr('offset', '100%').attr('stop-color', '#d97706');

    // Glow filter for selected paths
    const glow = defs.append('filter').attr('id', 'glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers for edges
    for (const [cat, color] of Object.entries(VISUAL_COLORS)) {
      defs.append('marker')
        .attr('id', `arrow-${cat}`)
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

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg
      .attr('width', width)
      .attr('height', height)
      .call(zoom)
      .on('click', () => selectNode(null));

    // Links
    const linkGroup = g
      .append('g')
      .attr('class', 'links')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => VISUAL_COLORS[RELATION_TO_VISUAL[d.type]])
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', (d) => {
        if (!d.amount_cents) return 1.5;
        const dollars = d.amount_cents / 100;
        if (dollars >= 1_000_000_000) return 6;
        if (dollars >= 100_000_000) return 4;
        if (dollars >= 10_000_000) return 2.5;
        return 1.5;
      })
      .attr('marker-end', (d) => `url(#arrow-${RELATION_TO_VISUAL[d.type]})`);

    linkGroupRef.current = linkGroup;

    // Edge type labels (for all edges)
    const edgeLabels = g
      .append('g')
      .attr('class', 'edge-labels')
      .selectAll<SVGTextElement, GraphLink>('text')
      .data(links)
      .join('text')
      .attr('font-size', 8)
      .attr('fill', '#6b7280')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text((d) => {
        // Short type label for non-financial edges
        if (d.amount_cents) return '';
        const typeLabels: Record<RelationType, string> = {
          financial: '',
          political: 'Political',
          familial: 'Family',
          advisory: 'Advisor',
          employment: '',
          lobbying: 'Lobbying',
          diplomatic: 'Envoy',
          criminal: 'Criminal',
        };
        return typeLabels[d.type] || '';
      });

    edgeLabelGroupRef.current = edgeLabels;

    // Big money labels — financial amounts, bigger and bolder
    const moneyLinks = links.filter((d) => d.amount_cents && d.amount_cents >= 500000000);
    const amountLabels = g
      .append('g')
      .attr('class', 'amount-labels')
      .selectAll<SVGGElement, GraphLink>('g')
      .data(moneyLinks)
      .join('g');

    // Background rect for readability
    amountLabels
      .append('rect')
      .attr('fill', 'rgba(0,0,0,0.75)')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('x', -30)
      .attr('y', -10)
      .attr('width', 60)
      .attr('height', 20);

    amountLabels
      .append('text')
      .attr('font-size', 13)
      .attr('font-weight', '800')
      .attr('fill', '#ef4444')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('pointer-events', 'none')
      .text((d) => (d.amount_cents ? formatAmount(d.amount_cents) : ''));

    amountLabelGroupRef.current = amountLabels;

    // Node groups
    const nodeGroup = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', handleNodeClick as any)
      .on('dblclick', handleNodeDblClick as any);

    nodeGroupRef.current = nodeGroup;

    // Node circles — sized by impact
    nodeGroup
      .append('circle')
      .attr('r', (d) => getImpactRadius(impactScores.get(d.id) || 1, d.id))
      .attr('fill', (d) => {
        if (d.id === 'o-wlf') return 'url(#wlf-gradient)';
        return NODE_COLORS[d.type] || '#64748b';
      })
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-width', 1)
      .attr('class', 'node-circle');

    // Country flag emoji (rendered as foreignObject for proper emoji display)
    nodeGroup
      .filter((d) => d.type === 'country' && !!COUNTRY_FLAGS[d.id])
      .append('foreignObject')
      .attr('x', (d) => -(getImpactRadius(impactScores.get(d.id) || 1, d.id) * 0.9))
      .attr('y', (d) => -(getImpactRadius(impactScores.get(d.id) || 1, d.id) * 0.9))
      .attr('width', (d) => getImpactRadius(impactScores.get(d.id) || 1, d.id) * 1.8)
      .attr('height', (d) => getImpactRadius(impactScores.get(d.id) || 1, d.id) * 1.8)
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('font-size', (d: any) => `${getImpactRadius(impactScores.get(d.id) || 1, d.id) * 1.3}px`)
      .style('line-height', '1')
      .text((d: any) => COUNTRY_FLAGS[d.id] || '');

    // WLF special symbol
    nodeGroup
      .filter((d) => d.id === 'o-wlf')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 2)
      .attr('fill', '#1a1a2e')
      .attr('font-size', 28)
      .attr('font-weight', '900')
      .text('T');

    // WLF outer ring
    nodeGroup
      .filter((d) => d.id === 'o-wlf')
      .append('circle')
      .attr('r', 52)
      .attr('fill', 'none')
      .attr('stroke', '#fbbf24')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.6);

    // Person initials (for nodes without photos)
    nodeGroup
      .filter((d) => d.type === 'person' && !d.photo_url)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', '#fff')
      .attr('font-size', (d) => {
        const r = getImpactRadius(impactScores.get(d.id) || 1, d.id);
        return Math.max(10, r * 0.45);
      })
      .attr('font-weight', '700')
      .text((d) => {
        const parts = d.name.split(' ');
        return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '');
      });

    // Person photos (when photo_url available)
    const photoPeople = nodes.filter(n => n.type === 'person' && n.photo_url);
    for (const person of photoPeople) {
      const r = getImpactRadius(impactScores.get(person.id) || 1, person.id);
      const clipId = `clip-${person.id}`;
      defs.append('clipPath')
        .attr('id', clipId)
        .append('circle')
        .attr('r', r);

      nodeGroup
        .filter((d) => d.id === person.id)
        .append('image')
        .attr('href', person.photo_url!)
        .attr('x', -r)
        .attr('y', -r)
        .attr('width', r * 2)
        .attr('height', r * 2)
        .attr('clip-path', `url(#${clipId})`)
        .attr('preserveAspectRatio', 'xMidYMid slice');
    }

    // Type indicator letters for orgs/companies (not WLF, not countries)
    nodeGroup
      .filter((d) => d.type !== 'person' && d.type !== 'country' && d.id !== 'o-wlf')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('fill', '#fff')
      .attr('font-size', 10)
      .text((d) => (d.type === 'organization' ? 'O' : 'C'));

    // Node labels below
    nodeGroup
      .append('text')
      .attr('dy', (d) => getImpactRadius(impactScores.get(d.id) || 1, d.id) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#d1d5db')
      .attr('font-size', (d) => {
        if (d.id === 'o-wlf') return 13;
        if (d.id === 'e-donald-trump') return 12;
        if (d.type === 'country') return 14;
        return d.type === 'person' ? 11 : 10;
      })
      .attr('font-weight', (d) => {
        if (d.id === 'o-wlf' || d.id === 'e-donald-trump') return '700';
        if (d.type === 'country') return '700';
        return d.type === 'person' ? '600' : '400';
      })
      .text(getNodeLabel);

    // Drag behavior
    const drag = d3
      .drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeGroup.call(drag);

    // Force simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => getImpactRadius(impactScores.get(d.id) || 1, d.id) + 25)
      )
      .alphaDecay(0.02)
      .on('tick', () => {
        linkGroup
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        edgeLabels
          .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
          .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 6);

        amountLabels
          .attr('transform', (d: any) => {
            const mx = (d.source.x + d.target.x) / 2;
            const my = (d.source.y + d.target.y) / 2;
            return `translate(${mx},${my})`;
          });

        nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    // Stop after tick budget
    let ticks = 0;
    simulation.on('tick.budget', () => {
      ticks++;
      if (ticks >= 200) {
        simulation.stop();
      }
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [activeFilters, focusedNodeId, handleNodeClick, handleNodeDblClick, selectNode]);

  // Separate effect for selection highlighting — no simulation rebuild, no bounce
  useEffect(() => {
    const nodeGroup = nodeGroupRef.current;
    const linkGroup = linkGroupRef.current;
    const edgeLabels = edgeLabelGroupRef.current;
    const amountLabels = amountLabelGroupRef.current;
    const links = currentLinksRef.current;

    if (!nodeGroup || !linkGroup) return;

    if (!selectedNodeId) {
      // Reset to defaults
      nodeGroup.attr('opacity', 1);
      nodeGroup.selectAll('.node-circle')
        .attr('stroke', 'rgba(255,255,255,0.15)')
        .attr('stroke-width', 1)
        .attr('filter', null);
      linkGroup
        .attr('stroke-opacity', 0.5)
        .attr('stroke', (d: any) => VISUAL_COLORS[RELATION_TO_VISUAL[d.type as RelationType]]);
      edgeLabels?.attr('fill-opacity', 1);
      amountLabels?.attr('opacity', 1);
      return;
    }

    // BFS from selected node — highlight entire reachable subgraph
    const reachable = bfsReachable(selectedNodeId, links);

    // Highlight reachable edges
    const reachableEdges = new Set<number>();
    linkGroup.each(function (d: any, i: number) {
      const srcId = typeof d.source === 'string' ? d.source : d.source.id;
      const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
      if (reachable.has(srcId) && reachable.has(tgtId)) {
        reachableEdges.add(i);
      }
    });

    linkGroup
      .attr('stroke-opacity', (d: any, i: number) => reachableEdges.has(i) ? 0.9 : 0.06)
      .attr('stroke', (d: any, i: number) => {
        if (reachableEdges.has(i)) {
          return HIGHLIGHT_EDGE_COLORS[RELATION_TO_VISUAL[d.type as RelationType]];
        }
        return VISUAL_COLORS[RELATION_TO_VISUAL[d.type as RelationType]];
      });

    nodeGroup
      .attr('opacity', (d: any) => reachable.has(d.id) ? 1 : 0.1);

    // Glow on selected node
    nodeGroup.selectAll('.node-circle')
      .attr('stroke', (d: any) => {
        if (d.id === selectedNodeId) return '#fff';
        if (reachable.has(d.id)) return 'rgba(255,255,255,0.3)';
        return 'rgba(255,255,255,0.05)';
      })
      .attr('stroke-width', (d: any) => d.id === selectedNodeId ? 3 : 1)
      .attr('filter', (d: any) => d.id === selectedNodeId ? 'url(#glow)' : null);

    edgeLabels?.attr('fill-opacity', (d: any, i: number) => reachableEdges.has(i) ? 1 : 0.1);
    amountLabels?.attr('opacity', (d: any) => {
      const srcId = typeof d.source === 'string' ? d.source : d.source.id;
      const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
      return reachable.has(srcId) && reachable.has(tgtId) ? 1 : 0.1;
    });
  }, [selectedNodeId]);

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-950 relative">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
