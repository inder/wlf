import Link from 'next/link';
import { notFound } from 'next/navigation';
import { entities, getEntity, getCountryConnections, formatAmount } from '@/lib/data';
import { VISUAL_COLORS, RELATION_TO_VISUAL, CLAIM_TYPE_LABELS } from '@/lib/types';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return entities
    .filter((e) => e.type === 'country')
    .map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entity = getEntity(slug);
  if (!entity) return { title: 'Not Found' };

  return {
    title: `${entity.name} — WLF Investigation`,
    description: entity.one_liner,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = getEntity(slug);
  if (!entity || entity.type !== 'country') notFound();

  const connections = getCountryConnections(entity.id);

  const totalMoney = connections.reduce(
    (sum, c) => sum + (c.relationship.amount_cents ?? 0),
    0
  );

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
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-start gap-5 mb-4">
              <div className="w-20 h-20 rounded-full bg-purple-900/50 flex items-center justify-center text-2xl font-bold text-purple-300 shrink-0">
                {entity.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{entity.name}</h1>
                <p className="text-gray-400 mt-1">
                  {connections.length} connections &middot;{' '}
                  {totalMoney > 0 && (
                    <span className="text-red-400">
                      {formatAmount(totalMoney)} in documented flows
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-4">
              <p className="text-purple-300 font-medium">{entity.one_liner}</p>
            </div>
          </div>

          {/* Bio */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Overview
            </h2>
            <p className="text-gray-300 leading-relaxed">{entity.bio}</p>
          </section>

          {/* Connected people */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Connected People & Organizations ({connections.length})
            </h2>
            <div className="space-y-3">
              {connections.map(({ relationship, person }) => {
                const color =
                  VISUAL_COLORS[
                    RELATION_TO_VISUAL[
                      relationship.type as keyof typeof RELATION_TO_VISUAL
                    ]
                  ];
                const claimLabel =
                  CLAIM_TYPE_LABELS[
                    relationship.claim_type as keyof typeof CLAIM_TYPE_LABELS
                  ];
                const href =
                  person.type === 'person'
                    ? `/person/${person.slug}`
                    : person.type === 'country'
                      ? `/country/${person.slug}`
                      : null;

                const card = (
                  <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
                    <span
                      className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {person.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                          {claimLabel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {relationship.description}
                      </p>
                      {relationship.amount_cents && (
                        <span className="text-sm text-red-400 font-semibold mt-1 inline-block">
                          {formatAmount(relationship.amount_cents)}
                        </span>
                      )}
                    </div>
                  </div>
                );

                return href ? (
                  <Link key={relationship.id} href={href}>
                    {card}
                  </Link>
                ) : (
                  <div key={relationship.id}>{card}</div>
                );
              })}
            </div>
          </section>

          <div className="flex gap-4 pt-6 border-t border-gray-800">
            <Link
              href="/graph"
              className="text-orange-500 hover:text-orange-400 text-sm font-medium"
            >
              &larr; View in network graph
            </Link>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
