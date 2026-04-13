'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import FilterPanel from '@/components/FilterPanel';
import TrumpFamily from '@/components/TrumpFamily';
import SearchBar from '@/components/SearchBar';
import ShareButtons from '@/components/ShareButtons';

const NetworkGraph = dynamic(() => import('@/components/NetworkGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-950">
      <div className="text-gray-500 animate-pulse">Loading network graph...</div>
    </div>
  ),
});

export default function GraphPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 dark-page">
      {/* Top bar */}
      <div className="flex-none h-14 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 flex items-center px-6 z-40">
        <Link href="/" className="text-lg font-bold tracking-tight">
          WLF<span className="text-orange-500">.</span>investigation
        </Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <SearchBar />
          <Link href="/flows" className="text-gray-400 hover:text-white transition-colors">
            Money Flows
          </Link>
          <Link href="/timeline" className="text-gray-400 hover:text-white transition-colors">
            Timeline
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/melania" className="text-pink-400 hover:text-pink-300 transition-colors">
            $MELANIA
          </Link>
          <Link href="/methodology" className="text-gray-400 hover:text-white transition-colors">
            Methodology
          </Link>
          <ShareButtons />
        </div>
      </div>

      {/* Trump Family strip */}
      <TrumpFamily />

      {/* Graph area */}
      <div className="flex-1 relative">
        <FilterPanel />
        <NetworkGraph />
        <Sidebar />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-30 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
          <div className="flex gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              Person
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              Country
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              Org
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)' }} />
              WLF
            </div>
          </div>
          <div className="flex gap-4 text-xs text-gray-400 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-red-500" />
              Money
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-blue-500" />
              Power
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-green-500" />
              Personal
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">
            Click: highlight network | Double-click: focus 2-hop | Drag: move
          </p>
        </div>
      </div>
    </div>
  );
}
