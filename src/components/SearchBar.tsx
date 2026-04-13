'use client';

import { useState, useRef, useEffect } from 'react';
import { useGraphStore } from '@/store/graph-store';
import { searchEntities } from '@/lib/data';
import type { Entity } from '@/lib/types';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Entity[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectNode, setSearch } = useGraphStore();

  useEffect(() => {
    if (query.length >= 2) {
      const matches = searchEntities(query);
      setResults(matches.slice(0, 8));
      setIsOpen(matches.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    setSearch(query);
  }, [query, setSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(entity: Entity) {
    selectNode(entity.id);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  }

  const typeColors: Record<string, string> = {
    person: 'bg-orange-500',
    country: 'bg-purple-500',
    organization: 'bg-cyan-500',
    company: 'bg-slate-500',
    government_body: 'bg-purple-500',
    pac: 'bg-pink-500',
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search entities..."
          className="w-56 pl-9 pr-3 py-1.5 bg-gray-800/80 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 transition-colors"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-72 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl overflow-hidden z-50">
          {results.map((entity) => (
            <button
              key={entity.id}
              onClick={() => handleSelect(entity)}
              className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-gray-800/80 transition-colors text-left"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${typeColors[entity.type] || 'bg-gray-500'}`}
              />
              <div className="min-w-0">
                <div className="text-sm text-gray-200 truncate">{entity.name}</div>
                <div className="text-xs text-gray-500 truncate">{entity.one_liner}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
