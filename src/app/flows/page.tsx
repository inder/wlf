'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { formatAmount } from '@/lib/data';

const SankeyDiagram = dynamic(() => import('@/components/SankeyDiagram'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-950">
      <div className="text-gray-500 animate-pulse">Loading money flows...</div>
    </div>
  ),
});

const KEY_FLOWS = [
  { from: 'Tahnoun (UAE)', to: 'WLF', amount: 50000000000, color: '#ef4444' },
  { from: 'MGX', to: 'WLF (USD1)', amount: 200000000000, color: '#dc2626' },
  { from: 'FFF ($TRUMP)', to: 'WLF', amount: 35000000000, color: '#f87171' },
  { from: 'WLF', to: 'Trump Family', amount: 18700000000, color: '#b91c1c' },
  { from: 'Justin Sun', to: 'WLF', amount: 7500000000, color: '#f87171' },
  { from: 'WLF', to: 'Dolomite', amount: 7500000000, color: '#ef4444' },
  { from: 'Witkoff Group', to: 'Qatar', amount: 62300000000, color: '#dc2626' },
];

export default function FlowsPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Top bar — matches graph page */}
      <div className="flex-none h-14 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 flex items-center px-6 z-40">
        <Link href="/" className="text-lg font-bold tracking-tight">
          WLF<span className="text-orange-500">.</span>investigation
        </Link>
        <div className="ml-auto flex gap-4 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/graph" className="text-gray-400 hover:text-white transition-colors">
            Network Graph
          </Link>
          <Link href="/methodology" className="text-gray-400 hover:text-white transition-colors">
            Methodology
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Money Flows
          </h1>
          <p className="text-gray-400 text-sm mt-1 max-w-2xl">
            Follow the money through World Liberty Financial. This Sankey diagram
            traces documented financial flows between entities — foreign governments,
            Trump family members, and crypto intermediaries. Click any node to
            isolate its connections.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Sankey diagram */}
        <div className="flex-1 min-h-0">
          <SankeyDiagram />
        </div>

        {/* Side legend */}
        <div className="flex-none w-64 border-l border-gray-800/50 overflow-y-auto p-4 hidden lg:block">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Key Flows
          </h3>
          <div className="space-y-2">
            {KEY_FLOWS.map((flow, i) => (
              <div
                key={i}
                className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-2.5"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: flow.color }}
                  />
                  <span className="text-gray-400 truncate">
                    {flow.from}
                  </span>
                  <span className="text-gray-600">&rarr;</span>
                  <span className="text-gray-400 truncate">
                    {flow.to}
                  </span>
                </div>
                <div className="text-red-400 font-bold text-sm mt-1 pl-4">
                  {formatAmount(flow.amount)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800/50">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Node Colors
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-600" />
                <span className="text-gray-400">World Liberty Financial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-orange-500" />
                <span className="text-gray-400">Person</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-purple-500" />
                <span className="text-gray-400">Country</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-cyan-500" />
                <span className="text-gray-400">Organization</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800/50">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              How to Read
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Flow width represents dollar amount. Redder flows indicate larger
              sums. Click a node to highlight only its incoming and outgoing
              connections. Hover over any flow for details.
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/graph"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
            >
              &larr; Network Graph
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
