'use client';

import { useGraphStore } from '@/store/graph-store';
import { VISUAL_COLORS, RELATION_TO_VISUAL, ALL_FILTER_TYPES } from '@/lib/types';
import type { RelationType } from '@/lib/types';

const FILTER_OPTIONS: Array<{ type: RelationType; label: string }> = [
  { type: 'financial', label: 'Money' },
  { type: 'political', label: 'Political' },
  { type: 'diplomatic', label: 'Diplomatic' },
  { type: 'advisory', label: 'Advisory' },
  { type: 'employment', label: 'Employment' },
  { type: 'familial', label: 'Family' },
  { type: 'lobbying', label: 'Lobbying' },
  { type: 'criminal', label: 'Criminal' },
];

export default function FilterPanel() {
  const { activeFilters, toggleFilter, setFilters, focusedNodeId, focusNode } = useGraphStore();

  const allActive = activeFilters.length === ALL_FILTER_TYPES.length;

  return (
    <div className="absolute top-4 left-4 z-30 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl p-4 max-w-[240px]">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Filter Connections
      </h3>
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ type, label }) => {
          const active = activeFilters.includes(type);
          const color = VISUAL_COLORS[RELATION_TO_VISUAL[type]];
          return (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active
                  ? 'text-white'
                  : 'text-gray-500 opacity-50'
              }`}
              style={{
                backgroundColor: active ? color + '33' : 'transparent',
                borderWidth: 1,
                borderColor: active ? color : '#374151',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {!allActive && (
        <button
          onClick={() => setFilters([...ALL_FILTER_TYPES])}
          className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Show all
        </button>
      )}
      {focusedNodeId && (
        <button
          onClick={() => focusNode(null)}
          className="mt-2 ml-3 text-xs text-orange-500 hover:text-orange-300 transition-colors"
        >
          Exit focus mode
        </button>
      )}
    </div>
  );
}
