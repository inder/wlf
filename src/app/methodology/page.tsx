import Link from 'next/link';
import { SOURCE_TIER_CONFIG, CLAIM_TYPE_LABELS } from '@/lib/types';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            WLF<span className="text-orange-500">.</span>investigation
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/graph" className="text-gray-400 hover:text-white transition-colors">
              Network Graph
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Methodology & Editorial Standards</h1>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Source Tiers</h2>
            <p className="text-gray-400 mb-4">
              Every claim on this site is linked to at least one source. Sources are
              classified into four tiers based on their reliability and editorial
              standards.
            </p>
            <div className="space-y-3">
              {Object.entries(SOURCE_TIER_CONFIG).map(([key, config]) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg"
                >
                  <span
                    className="mt-1 w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <div>
                    <span className="font-medium text-white">{config.label}</span>
                    <p className="text-sm text-gray-400 mt-1">
                      {key === 'official' &&
                        'Court filings, SEC records, FARA registrations, FEC data, blockchain transactions. Direct, verifiable evidence.'}
                      {key === 'major_publication' &&
                        'Reporting from publications with editorial review processes: NYT, WSJ, Reuters, CoinDesk, Bloomberg, CNBC, Forbes.'}
                      {key === 'specialist' &&
                        'Specialist and independent journalism, Wikipedia with citations, investigative outlets.'}
                      {key === 'social' &&
                        'Social media posts, self-published content, blog posts. Not used as sole sources for claims.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Claim Types</h2>
            <p className="text-gray-400 mb-4">
              Each connection between entities is classified by its evidentiary
              strength.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-900 rounded-lg">
                <span className="font-medium text-white">Documented</span>
                <p className="text-sm text-gray-400 mt-1">
                  Supported by official records or multiple major publication sources.
                  Court filings, SEC records, blockchain data.
                </p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <span className="font-medium text-white">Reported</span>
                <p className="text-sm text-gray-400 mt-1">
                  Reported by at least one major publication with editorial review.
                  The claim is attributed to the reporting outlet.
                </p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <span className="font-medium text-white">Alleged</span>
                <p className="text-sm text-gray-400 mt-1">
                  Based on a single source or specialist reporting. Explicitly
                  noted as an allegation. Uses language like &ldquo;according to&rdquo; or
                  &ldquo;reportedly.&rdquo;
                </p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <span className="font-medium text-white italic">Inferred</span>
                <p className="text-sm text-gray-400 mt-1">
                  Editorial connection drawn between documented facts. Explicitly
                  labeled as inferred. Displayed in italics to distinguish from
                  direct evidence.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Language Standards</h2>
            <ul className="space-y-2 text-gray-400">
              <li>&ldquo;Convicted of&rdquo; is used only for actual criminal convictions</li>
              <li>&ldquo;Charged with&rdquo; is used for formal charges</li>
              <li>&ldquo;Accused of&rdquo; is used for allegations without formal charges</li>
              <li>&ldquo;Connected to&rdquo; is used for documented relationships</li>
              <li>We do not use &ldquo;corrupt&rdquo; or &ldquo;criminal&rdquo; without a conviction</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Corrections</h2>
            <p className="text-gray-400">
              If you believe any information on this site is inaccurate, please
              open an issue on our GitHub repository with the specific claim, the
              correction, and supporting evidence. We will review and update
              promptly. Accuracy is our highest priority.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
            <p className="text-gray-400">
              This site presents publicly available information organized for
              transparency and public interest. It is not affiliated with any
              political party, government, organization, or the entities described
              herein. The authors are not legal professionals. This is journalism,
              not legal advice. All data is sourced from public records and
              published reporting.
            </p>
          </section>

          <div className="flex gap-4 pt-6 border-t border-gray-800">
            <Link
              href="/"
              className="text-orange-500 hover:text-orange-400 text-sm font-medium"
            >
              &larr; Back to home
            </Link>
            <Link
              href="/graph"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              Explore the network
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
