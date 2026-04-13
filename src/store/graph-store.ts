'use client';

import { create } from 'zustand';
import type { RelationType } from '@/lib/types';
import { ALL_FILTER_TYPES } from '@/lib/types';

interface GraphState {
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  activeFilters: RelationType[];
  searchQuery: string;

  selectNode: (id: string | null) => void;
  focusNode: (id: string | null) => void;
  toggleFilter: (filter: RelationType) => void;
  setFilters: (filters: RelationType[]) => void;
  setSearch: (query: string) => void;
  reset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  selectedNodeId: null,
  focusedNodeId: null,
  activeFilters: [...ALL_FILTER_TYPES],
  searchQuery: '',

  selectNode: (id) =>
    set((state) => ({
      selectedNodeId: state.selectedNodeId === id ? null : id,
    })),
  focusNode: (id) => set({ focusedNodeId: id }),
  toggleFilter: (filter) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(filter)
        ? state.activeFilters.filter((f) => f !== filter)
        : [...state.activeFilters, filter],
    })),
  setFilters: (filters) => set({ activeFilters: filters }),
  setSearch: (query) => set({ searchQuery: query }),
  reset: () =>
    set({
      selectedNodeId: null,
      focusedNodeId: null,
      activeFilters: [...ALL_FILTER_TYPES],
      searchQuery: '',
    }),
}));
