'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { entities } from '@/lib/data';
import type { TimelineEvent, Entity, EntityType } from '@/lib/types';

const ENTITY_COLORS: Record<EntityType, string> = {
  person: '#f97316',       // orange-500
  organization: '#06b6d4', // cyan-500
  country: '#a855f7',      // purple-500
  government_body: '#3b82f6', // blue-500
  pac: '#ef4444',          // red-500
  company: '#06b6d4',      // cyan-500
};

const ENTITY_COLOR_CLASSES: Record<EntityType, string> = {
  person: 'bg-orange-500',
  organization: 'bg-cyan-500',
  country: 'bg-purple-500',
  government_body: 'bg-blue-500',
  pac: 'bg-red-500',
  company: 'bg-cyan-500',
};

const ENTITY_BORDER_CLASSES: Record<EntityType, string> = {
  person: 'border-orange-500/40',
  organization: 'border-cyan-500/40',
  country: 'border-purple-500/40',
  government_body: 'border-blue-500/40',
  pac: 'border-red-500/40',
  company: 'border-cyan-500/40',
};

const ENTITY_TEXT_CLASSES: Record<EntityType, string> = {
  person: 'text-orange-400',
  organization: 'text-cyan-400',
  country: 'text-purple-400',
  government_body: 'text-blue-400',
  pac: 'text-red-400',
  company: 'text-cyan-400',
};

function formatDate(date: string, precision: string): string {
  if (precision === 'day') {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  if (precision === 'month') {
    const [y, m] = date.split('-');
    const d = new Date(parseInt(y), parseInt(m) - 1);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
  if (precision === 'year') return date;
  return `~${date}`;
}

function getYear(date: string): string {
  return date.substring(0, 4);
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Build entity lookup
  const entityMap = useMemo(() => {
    const map = new Map<string, Entity>();
    for (const e of entities) map.set(e.id, e);
    return map;
  }, []);

  // Get unique entities that appear in events
  const eventEntities = useMemo(() => {
    const ids = new Set(events.map(e => e.entity_id));
    return Array.from(ids)
      .map(id => entityMap.get(id))
      .filter((e): e is Entity => !!e)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [events, entityMap]);

  // Filter events
  const filteredEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    if (!selectedEntity) return sorted;
    return sorted.filter(e => e.entity_id === selectedEntity);
  }, [events, selectedEntity]);

  // Group by year for section headers
  const yearGroups = useMemo(() => {
    const groups: { year: string; events: TimelineEvent[] }[] = [];
    let currentYear = '';
    for (const ev of filteredEvents) {
      const year = getYear(ev.date);
      if (year !== currentYear) {
        currentYear = year;
        groups.push({ year, events: [ev] });
      } else {
        groups[groups.length - 1].events.push(ev);
      }
    }
    return groups;
  }, [filteredEvents]);

  // Determine if an event is "political" or "financial" for narrative highlighting
  const getEventCategory = (event: TimelineEvent): 'political' | 'financial' | 'investigation' | 'neutral' => {
    const text = event.event.toLowerCase();
    if (text.includes('senate') || text.includes('inaugurate') || text.includes('envoy') ||
        text.includes('appoint') || text.includes('sec ') || text.includes('sanction') ||
        text.includes('ai chip') || text.includes('approve')) return 'political';
    if (text.includes('invest') || text.includes('$') || text.includes('stake') ||
        text.includes('borrow') || text.includes('deal') || text.includes('fee') ||
        text.includes('stablecoin') || text.includes('usd1')) return 'financial';
    if (text.includes('investigate') || text.includes('scrutiny') || text.includes('inquiry') ||
        text.includes('letter') || text.includes('expose')) return 'investigation';
    return 'neutral';
  };

  const categoryIcons: Record<string, string> = {
    political: '\u26A1',
    financial: '\uD83D\uDCB0',
    investigation: '\uD83D\uDD0D',
    neutral: '\u25CF',
  };

  const categoryGlowClasses: Record<string, string> = {
    political: 'shadow-blue-500/30',
    financial: 'shadow-red-500/30',
    investigation: 'shadow-yellow-500/30',
    neutral: 'shadow-gray-500/20',
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Entity filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedEntity(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !selectedEntity
              ? 'bg-white/10 text-white ring-1 ring-white/20'
              : 'bg-gray-800/50 text-gray-500 hover:text-gray-300 hover:bg-gray-800'
          }`}
        >
          All Events ({events.length})
        </button>
        {eventEntities.map(entity => {
          const count = events.filter(e => e.entity_id === entity.id).length;
          return (
            <button
              key={entity.id}
              onClick={() => setSelectedEntity(selectedEntity === entity.id ? null : entity.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedEntity === entity.id
                  ? 'bg-white/10 text-white ring-1 ring-white/20'
                  : 'bg-gray-800/50 text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${ENTITY_COLOR_CLASSES[entity.type]}`}
              />
              {entity.name}
              <span className="text-gray-600">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Narrative correlation callout */}
      {!selectedEntity && (
        <div className="mb-8 bg-gradient-to-r from-red-950/30 via-gray-900/50 to-blue-950/30 border border-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-red-400 font-semibold">Pattern:</span> Financial transactions (
            <span className="text-red-400">red</span>) consistently precede or follow political events (
            <span className="text-blue-400">blue</span>). Sun invests $75M, his SEC case gets dropped.
            Tahnoun buys 49% of WLF, UAE gets 500K AI chips. The timeline makes the quid pro quo structure
            impossible to ignore.
          </p>
        </div>
      )}

      {/* Timeline */}
      <div ref={timelineRef} className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800" />

        {yearGroups.map((group) => (
          <div key={group.year} className="mb-2">
            {/* Year marker */}
            <div className="relative flex items-center mb-6">
              <div className="absolute left-4 sm:left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-600 z-10" />
              <div className="ml-10 sm:ml-16 text-2xl font-bold text-gray-300 tracking-tight">
                {group.year}
              </div>
            </div>

            {/* Events in this year */}
            {group.events.map((ev, idx) => {
              const entity = entityMap.get(ev.entity_id);
              const category = getEventCategory(ev);
              const isHovered = hoveredEvent === ev.id;

              return (
                <div
                  key={ev.id}
                  className="relative flex items-start mb-6 group"
                  onMouseEnter={() => setHoveredEvent(ev.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Dot on timeline */}
                  <div
                    className={`absolute left-4 sm:left-8 -translate-x-1/2 w-3 h-3 rounded-full z-10 transition-all duration-200 ${
                      isHovered ? 'scale-150 shadow-lg ' + categoryGlowClasses[category] : ''
                    }`}
                    style={{ backgroundColor: entity ? ENTITY_COLORS[entity.type] : '#6b7280' }}
                  />

                  {/* Event card */}
                  <div
                    className={`ml-10 sm:ml-16 flex-1 bg-gray-900/60 border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? `border-gray-600 ${categoryGlowClasses[category]} shadow-lg translate-x-1`
                        : 'border-gray-800/50 hover:border-gray-700'
                    }`}
                    onClick={() => {
                      if (entity) {
                        setSelectedEntity(selectedEntity === entity.id ? null : entity.id);
                      }
                    }}
                  >
                    {/* Date + entity badge row */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">
                        {formatDate(ev.date, ev.date_precision)}
                      </span>
                      <span className="text-sm">{categoryIcons[category]}</span>
                      {entity && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${ENTITY_BORDER_CLASSES[entity.type]} ${ENTITY_TEXT_CLASSES[entity.type]} bg-gray-900/80`}
                        >
                          {entity.name}
                        </span>
                      )}
                    </div>

                    {/* Event description */}
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {ev.event}
                    </p>

                    {/* Source count */}
                    <div className="mt-2 text-[10px] text-gray-600">
                      {ev.source_ids.length} source{ev.source_ids.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* End marker */}
        <div className="relative flex items-center">
          <div className="absolute left-4 sm:left-8 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700" />
          <div className="ml-10 sm:ml-16 text-xs text-gray-600 italic">
            Investigation ongoing...
          </div>
        </div>
      </div>
    </div>
  );
}
