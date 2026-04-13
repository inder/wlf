import Link from 'next/link';
import { getTimeline } from '@/lib/data';
import Timeline from '@/components/Timeline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timeline of Events — WLF Investigation',
  description:
    'Chronological timeline revealing the correlation between political appointments, foreign investments, and financial self-dealing in Trump\'s World Liberty Financial.',
};

export default function TimelinePage() {
  const events = getTimeline();

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Top bar — matches graph page pattern */}
      <div className="flex-none h-14 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 flex items-center px-6 z-40">
        <Link href="/" className="text-lg font-bold tracking-tight">
          WLF<span className="text-orange-500">.</span>investigation
        </Link>
        <div className="ml-auto flex gap-4 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/graph" className="text-gray-400 hover:text-white transition-colors">
            Graph
          </Link>
          <Link href="/methodology" className="text-gray-400 hover:text-white transition-colors">
            Methodology
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Timeline of Events
        </h1>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Follow the sequence. Investments precede political favors. Appointments follow payments.
          The chronology tells the story the participants would rather you not see.
        </p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Person
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Org / Company
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Country
          </span>
        </div>
        <div className="mt-2 flex justify-center gap-6 text-xs text-gray-600">
          <span>&#x26A1; Political</span>
          <span>&#x1F4B0; Financial</span>
          <span>&#x1F50D; Investigation</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 pb-20">
        <Timeline events={events} />
      </div>

      {/* Bottom link */}
      <div className="text-center pb-8">
        <Link
          href="/graph"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Explore the network graph
        </Link>
      </div>
    </div>
  );
}
