import Link from 'next/link';
import { SOURCE_TIER_CONFIG, CLAIM_TYPE_LABELS } from '@/lib/types';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#e0dcd4]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            WLF<span className="text-red-700">.</span>investigation
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/graph" className="text-gray-500 hover:text-gray-900 transition-colors">
              Network Graph
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-0.5 bg-red-700 mb-6" />
          <h1 className="font-headline text-4xl font-bold mb-2 text-gray-900">
            Methodology &amp; Editorial Standards
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            How we verify claims, classify sources, and maintain editorial integrity.
          </p>
          <hr className="editorial-rule-double mb-10" />

          <section className="mb-10">
            <h2 className="font-headline text-2xl font-semibold mb-4 text-gray-900">Source Tiers</h2>
            <p className="text-gray-600 mb-4">
              Every claim on this site is linked to at least one source. Sources are
              classified into four tiers based on their reliability and editorial
              standards.
            </p>
            <div className="space-y-3">
              {Object.entries(SOURCE_TIER_CONFIG).map(([key, config]) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-4 bg-white border border-[#e0dcd4] rounded-sm"
                >
                  <span
                    className="mt-1 w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <div>
                    <span className="font-semibold text-gray-900">{config.label}</span>
                    <p className="text-sm text-gray-600 mt-1">
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

          <hr className="editorial-rule" />

          <section className="mb-10">
            <h2 className="font-headline text-2xl font-semibold mb-4 text-gray-900">Claim Types</h2>
            <p className="text-gray-600 mb-4">
              Each connection between entities is classified by its evidentiary
              strength.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-white border border-[#e0dcd4] rounded-sm">
                <span className="font-semibold text-gray-900">Documented</span>
                <p className="text-sm text-gray-600 mt-1">
                  Supported by official records or multiple major publication sources.
                  Court filings, SEC records, blockchain data.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#e0dcd4] rounded-sm">
                <span className="font-semibold text-gray-900">Reported</span>
                <p className="text-sm text-gray-600 mt-1">
                  Reported by at least one major publication with editorial review.
                  The claim is attributed to the reporting outlet.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#e0dcd4] rounded-sm">
                <span className="font-semibold text-gray-900">Alleged</span>
                <p className="text-sm text-gray-600 mt-1">
                  Based on a single source or specialist reporting. Explicitly
                  noted as an allegation. Uses language like &ldquo;according to&rdquo; or
                  &ldquo;reportedly.&rdquo;
                </p>
              </div>
              <div className="p-4 bg-white border border-[#e0dcd4] rounded-sm">
                <span className="font-semibold text-gray-900 italic">Inferred</span>
                <p className="text-sm text-gray-600 mt-1">
                  Editorial connection drawn between documented facts. Explicitly
                  labeled as inferred. Displayed in italics to distinguish from
                  direct evidence.
                </p>
              </div>
            </div>
          </section>

          <hr className="editorial-rule" />

          <section className="mb-10">
            <h2 className="font-headline text-2xl font-semibold mb-4 text-gray-900">Language Standards</h2>
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>&ldquo;Convicted of&rdquo; is used only for actual criminal convictions</li>
              <li>&ldquo;Charged with&rdquo; is used for formal charges</li>
              <li>&ldquo;Accused of&rdquo; is used for allegations without formal charges</li>
              <li>&ldquo;Connected to&rdquo; is used for documented relationships</li>
              <li>We do not use &ldquo;corrupt&rdquo; or &ldquo;criminal&rdquo; without a conviction</li>
            </ul>
          </section>

          <hr className="editorial-rule" />

          <section className="mb-10">
            <h2 className="font-headline text-2xl font-semibold mb-4 text-gray-900">Corrections</h2>
            <p className="text-gray-600">
              If you believe any information on this site is inaccurate, please
              open an issue on our GitHub repository with the specific claim, the
              correction, and supporting evidence. We will review and update
              promptly. Accuracy is our highest priority.
            </p>
          </section>

          <hr className="editorial-rule" />

          <section className="mb-10">
            <h2 className="font-headline text-2xl font-semibold mb-4 text-gray-900">Disclaimer</h2>
            <p className="text-gray-600">
              This site presents publicly available information organized for
              transparency and public interest. It is not affiliated with any
              political party, government, organization, or the entities described
              herein. The authors are not legal professionals. This is journalism,
              not legal advice. All data is sourced from public records and
              published reporting.
            </p>
          </section>

          <div className="flex gap-4 pt-6 border-t border-[#e0dcd4]">
            <Link
              href="/"
              className="text-red-700 hover:text-red-600 text-sm font-medium"
            >
              &larr; Back to home
            </Link>
            <Link
              href="/graph"
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              Explore the network
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
