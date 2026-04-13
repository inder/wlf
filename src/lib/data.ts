import entitiesData from '@/data/entities.json';
import relationshipsData from '@/data/relationships.json';
import sourcesData from '@/data/sources.json';
import timelineData from '@/data/timeline.json';
import type { Entity, Relationship, Source, GraphNode, GraphLink, RelationType, TimelineEvent } from './types';
import { TRUMP_FAMILY_IDS } from './types';

export const entities: Entity[] = entitiesData as Entity[];
export const relationships: Relationship[] = relationshipsData as Relationship[];
export const sources: Source[] = sourcesData as Source[];
export const timeline: TimelineEvent[] = timelineData as TimelineEvent[];

export function getTimeline(entityId?: string): TimelineEvent[] {
  if (!entityId) return [...timeline].sort((a, b) => a.date.localeCompare(b.date));
  return timeline.filter(e => e.entity_id === entityId).sort((a, b) => a.date.localeCompare(b.date));
}

export function getEntity(slug: string): Entity | undefined {
  return entities.find(e => e.slug === slug);
}

export function getEntityById(id: string): Entity | undefined {
  return entities.find(e => e.id === id);
}

export function getEntityConnections(entityId: string): Array<{
  relationship: Relationship;
  connectedEntity: Entity;
  direction: 'outgoing' | 'incoming';
}> {
  const connections: Array<{
    relationship: Relationship;
    connectedEntity: Entity;
    direction: 'outgoing' | 'incoming';
  }> = [];

  for (const rel of relationships) {
    if (rel.source_id === entityId) {
      const target = getEntityById(rel.target_id);
      if (target) {
        connections.push({ relationship: rel, connectedEntity: target, direction: 'outgoing' });
      }
    } else if (rel.target_id === entityId) {
      const source = getEntityById(rel.source_id);
      if (source) {
        connections.push({ relationship: rel, connectedEntity: source, direction: 'incoming' });
      }
    }
  }

  return connections;
}

export function getSourcesByIds(ids: string[]): Source[] {
  return sources.filter(s => ids.includes(s.id));
}

export function getCountryConnections(countryId: string): Array<{
  relationship: Relationship;
  person: Entity;
}> {
  return relationships
    .filter(r => r.source_id === countryId || r.target_id === countryId)
    .map(r => {
      const otherId = r.source_id === countryId ? r.target_id : r.source_id;
      const person = getEntityById(otherId);
      return person ? { relationship: r, person } : null;
    })
    .filter((x): x is { relationship: Relationship; person: Entity } => x !== null);
}

export function getGraphData(filter?: string): { nodes: GraphNode[]; links: GraphLink[] } {
  const filteredRelationships = filter
    ? relationships.filter(r => r.type === filter)
    : relationships;

  const connectedIds = new Set<string>();
  for (const r of filteredRelationships) {
    connectedIds.add(r.source_id);
    connectedIds.add(r.target_id);
  }

  const nodes: GraphNode[] = entities
    .filter(e => connectedIds.has(e.id))
    .map(e => ({
      id: e.id,
      slug: e.slug,
      name: e.name,
      type: e.type,
      role: e.role,
      one_liner: e.one_liner,
      photo_url: e.photo_url ?? undefined,
    }));

  const links: GraphLink[] = filteredRelationships.map(r => ({
    source: r.source_id,
    target: r.target_id,
    type: r.type,
    claim_type: r.claim_type,
    description: r.description,
    amount_cents: r.amount_cents,
  }));

  return { nodes, links };
}

export function formatAmount(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(1)}B`;
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(0)}M`;
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(0)}K`;
  return `$${dollars.toFixed(0)}`;
}

export function getStats() {
  const people = entities.filter(e => e.type === 'person').length;
  const countries = entities.filter(e => e.type === 'country').length;
  const orgs = entities.filter(e => ['organization', 'company'].includes(e.type)).length;
  const financialRels = relationships.filter(r => r.type === 'financial');
  const totalFlow = financialRels.reduce((sum, r) => sum + (r.amount_cents ?? 0), 0);
  const criminalConnections = relationships.filter(r => r.type === 'criminal').length;

  return { people, countries, orgs, totalFlow, criminalConnections, totalRelationships: relationships.length };
}

export function getTrumpFamily(): Entity[] {
  return TRUMP_FAMILY_IDS
    .map(id => entities.find(e => e.id === id))
    .filter((e): e is Entity => !!e);
}

export function getTrumpFamilyConnections(): Array<{
  member: Entity;
  connections: Array<{ relationship: Relationship; connectedEntity: Entity; direction: 'outgoing' | 'incoming' }>;
}> {
  return getTrumpFamily().map(member => ({
    member,
    connections: getEntityConnections(member.id),
  }));
}

export function computeImpactScores(links: GraphLink[]): Map<string, number> {
  const scores = new Map<string, number>();

  // Count connections and financial weight per node
  for (const link of links) {
    const srcId = typeof link.source === 'string' ? link.source : link.source.id;
    const tgtId = typeof link.target === 'string' ? link.target : link.target.id;
    for (const id of [srcId, tgtId]) {
      const current = scores.get(id) || 0;
      let weight = 1;
      if (link.amount_cents) {
        weight += Math.log10(link.amount_cents / 100) * 0.4;
      }
      scores.set(id, current + weight);
    }
  }

  // WLF is the gravitational center
  scores.set('o-wlf', (scores.get('o-wlf') || 0) * 3);
  // Trump gets a boost
  scores.set('e-donald-trump', (scores.get('e-donald-trump') || 0) * 2);

  return scores;
}

export function bfsReachable(startId: string, links: GraphLink[]): Set<string> {
  const visited = new Set<string>([startId]);
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const link of links) {
      const srcId = typeof link.source === 'string' ? link.source : link.source.id;
      const tgtId = typeof link.target === 'string' ? link.target : link.target.id;
      if (srcId === current && !visited.has(tgtId)) {
        visited.add(tgtId);
        queue.push(tgtId);
      }
      if (tgtId === current && !visited.has(srcId)) {
        visited.add(srcId);
        queue.push(srcId);
      }
    }
  }

  return visited;
}

export function bfsReachableNHops(startId: string, links: GraphLink[], maxHops: number): Set<string> {
  const visited = new Set<string>([startId]);
  const queue: Array<{ id: string; depth: number }> = [{ id: startId, depth: 0 }];

  while (queue.length > 0) {
    const { id: current, depth } = queue.shift()!;
    if (depth >= maxHops) continue;
    for (const link of links) {
      const srcId = typeof link.source === 'string' ? link.source : link.source.id;
      const tgtId = typeof link.target === 'string' ? link.target : link.target.id;
      if (srcId === current && !visited.has(tgtId)) {
        visited.add(tgtId);
        queue.push({ id: tgtId, depth: depth + 1 });
      }
      if (tgtId === current && !visited.has(srcId)) {
        visited.add(srcId);
        queue.push({ id: srcId, depth: depth + 1 });
      }
    }
  }

  return visited;
}

export function searchEntities(query: string): Entity[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return entities.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.one_liner.toLowerCase().includes(q) ||
    (e.role && e.role.toLowerCase().includes(q))
  );
}

export function getFilteredGraphData(activeFilters: RelationType[]): { nodes: GraphNode[]; links: GraphLink[] } {
  const filteredRelationships = relationships.filter(r => activeFilters.includes(r.type));

  const connectedIds = new Set<string>();
  for (const r of filteredRelationships) {
    connectedIds.add(r.source_id);
    connectedIds.add(r.target_id);
  }

  const nodes: GraphNode[] = entities
    .filter(e => connectedIds.has(e.id))
    .map(e => ({
      id: e.id,
      slug: e.slug,
      name: e.name,
      type: e.type,
      role: e.role,
      one_liner: e.one_liner,
      photo_url: e.photo_url ?? undefined,
    }));

  const links: GraphLink[] = filteredRelationships.map(r => ({
    source: r.source_id,
    target: r.target_id,
    type: r.type,
    claim_type: r.claim_type,
    description: r.description,
    amount_cents: r.amount_cents,
  }));

  return { nodes, links };
}
