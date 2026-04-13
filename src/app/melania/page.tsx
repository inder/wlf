'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

const MelaniaGraph = dynamic(() => import('@/components/MelaniaGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-950">
      <div className="text-pink-400 animate-pulse">Loading $MELANIA investigation...</div>
    </div>
  ),
});

const KEY_FINDINGS = [
  {
    title: 'The $65M Extraction',
    description: 'MKT World LLC — Melania\'s company since 2021 — withdrew $64.7M in primary sales and fees from the $MELANIA token. The token crashed 98% after insiders sold.',
    color: 'from-pink-900/40 to-pink-950/40',
    border: 'border-pink-800/30',
  },
  {
    title: 'The Sniping Admission',
    description: 'Hayden Davis, CEO of Kelsier Ventures, deployed the $MELANIA token and admitted to sniping it — buying tokens before the public announcement for guaranteed profits.',
    color: 'from-red-900/40 to-red-950/40',
    border: 'border-red-800/30',
  },
  {
    title: 'The $LIBRA Connection',
    description: 'The same Kelsier team that deployed $MELANIA later deployed $LIBRA for Argentine President Milei, leading to a political scandal. Court filings allege they "weaponized fame to disarm diligence."',
    color: 'from-purple-900/40 to-purple-950/40',
    border: 'border-purple-800/30',
  },
  {
    title: 'Two Days, Two Coins',
    description: 'Bill Zanker helped launch BOTH $TRUMP (Jan 17) and $MELANIA (Jan 19). When $MELANIA launched, $TRUMP crashed 40%. Same operator, sequential extraction, retail investors left holding the bag.',
    color: 'from-orange-900/40 to-orange-950/40',
    border: 'border-orange-800/30',
  },
  {
    title: 'The Billion-Dollar Family',
    description: '$362M from $TRUMP + $65M from $MELANIA + $550M from WLF + $42M from USD1 = over $1 billion extracted across the Trump family\'s crypto operations.',
    color: 'from-amber-900/40 to-amber-950/40',
    border: 'border-amber-800/30',
  },
];

export default function MelaniaPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 dark-page">
      {/* Top bar */}
      <div className="flex-none h-14 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 flex items-center px-6 z-40">
        <Link href="/" className="text-lg font-bold tracking-tight">
          WLF<span className="text-orange-500">.</span>investigation
        </Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/graph" className="text-gray-400 hover:text-white transition-colors">
            Network Graph
          </Link>
          <Link href="/flows" className="text-gray-400 hover:text-white transition-colors">
            Money Flows
          </Link>
          <Link href="/timeline" className="text-gray-400 hover:text-white transition-colors">
            Timeline
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/methodology" className="text-gray-400 hover:text-white transition-colors">
            Methodology
          </Link>
          <ShareButtons />
        </div>
      </div>

      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            The <span className="text-pink-400">$MELANIA</span> Memecoin Investigation
          </h1>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl">
            On the night before the inauguration, the First Lady launched a memecoin that briefly
            hit $2 billion — then crashed 98%. The same deployer later ran the Argentine $LIBRA
            scandal. Bill Zanker connected both Trump memecoins. Dashed-border nodes link to the
            main WLF investigation.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Graph */}
        <div className="flex-1 min-h-0">
          <MelaniaGraph />
        </div>

        {/* Side panel */}
        <div className="flex-none w-72 border-l border-gray-800/50 overflow-y-auto p-4 hidden lg:block">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Key Findings
          </h3>
          <div className="space-y-3">
            {KEY_FINDINGS.map((finding, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl bg-gradient-to-br ${finding.color} border ${finding.border}`}
              >
                <h4 className="text-sm font-bold text-white mb-1">{finding.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{finding.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800/50">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Timeline
            </h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div><span className="text-gray-500">Jan 17, 2025</span> — $TRUMP launches</div>
              <div><span className="text-gray-500">Jan 19, 2025</span> — $MELANIA launches, $TRUMP crashes 40%</div>
              <div><span className="text-gray-500">Jan 20, 2025</span> — Inauguration</div>
              <div><span className="text-gray-500">Feb 2025</span> — $LIBRA scandal (same deployer)</div>
              <div><span className="text-gray-500">Oct 2025</span> — Court filing alleges conspiracy</div>
              <div><span className="text-gray-500">Dec 2025</span> — Bloomberg exposes Zanker&apos;s role in both coins</div>
              <div><span className="text-gray-500">Apr 2026</span> — Senate Banking Committee letter</div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/graph"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
            >
              &larr; Main Investigation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
