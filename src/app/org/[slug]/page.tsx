import Link from 'next/link';
import { notFound } from 'next/navigation';
import { entities, getEntity, getEntityConnections, getSourcesByIds, formatAmount } from '@/lib/data';
import { VISUAL_COLORS, RELATION_TO_VISUAL, CLAIM_TYPE_LABELS, SOURCE_TIER_CONFIG } from '@/lib/types';
import type { Metadata } from 'next';

const ORG_COLORS: Record<string, { bg: string; border: string; text: string; accent: string; indicator: string }> = {
  organization: {
    bg: 'bg-cyan-950/30',
    border: 'border-cyan-800/30',
    text: 'text-cyan-400',
    accent: 'text-cyan-300',
    indicator: 'bg-cyan-900/50',
  },
  company: {
    bg: 'bg-slate-800/30',
    border: 'border-slate-600/30',
    text: 'text-slate-400',
    accent: 'text-slate-300',
    indicator: 'bg-slate-800/50',
  },
};

export function generateStaticParams() {
  return entities
    .filter((e) => e.type === 'organization' || e.type === 'company')
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
    openGraph: {
      title: `${entity.name} — WLF Investigation`,
      description: entity.one_liner,
    },
  };
}

export default async function OrgPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = getEntity(slug);
  if (!entity || (entity.type !== 'organization' && entity.type !== 'company')) notFound();

  const colors = ORG_COLORS[entity.type] ?? ORG_COLORS.organization;
  const typeLabel = entity.type === 'company' ? 'Company' : 'Organization';
  const typeLetter = entity.type === 'company' ? 'C' : 'O';

  const connections = getEntityConnections(entity.id);
  const allSourceIds = connections.flatMap((c) => c.relationship.source_ids);
  const uniqueSourceIds = [...new Set(allSourceIds)];
  const allSources = getSourcesByIds(uniqueSourceIds);

  const totalMoney = connections.reduce(
    (sum, c) => sum + (c.relationship.amount_cents ?? 0),
    0
  );

  // Group connections by type
  const financial = connections.filter((c) => c.relationship.type === 'financial');
  const political = connections.filter(
    (c) => ['political', 'diplomatic', 'lobbying'].includes(c.relationship.type)
  );
  const employment = connections.filter(
    (c) => ['employment', 'advisory'].includes(c.relationship.type)
  );
  const personal = connections.filter(
    (c) => ['familial', 'criminal'].includes(c.relationship.type)
  );

  return (
    <div className="min-h-screen">
      {/* Nav */}
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
              <div className={`w-20 h-20 rounded-full ${colors.indicator} flex items-center justify-center text-2xl font-bold ${colors.accent} shrink-0`}>
                {typeLetter}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-medium uppercase tracking-wider`}>
                    {typeLabel}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{entity.name}</h1>
                {entity.role && (
                  <p className="text-gray-400 mt-1">{entity.role}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  {connections.length} connection{connections.length !== 1 ? 's' : ''}
                  {totalMoney > 0 && (
                    <>
                      {' '}&middot;{' '}
                      <span className="text-red-400">
                        {formatAmount(totalMoney)} in documented flows
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
              <p className={`${colors.accent} font-medium`}>{entity.one_liner}</p>
            </div>
          </div>

          {/* Bio */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Overview
            </h2>
            <p className="text-gray-300 leading-relaxed">{entity.bio}</p>
          </section>

          {/* Financial connections */}
          {financial.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
                Financial Connections ({financial.length})
              </h2>
              <div className="space-y-3">
                {financial.map(({ relationship, connectedEntity }) => (
                  <ConnectionCard
                    key={relationship.id}
                    relationship={relationship}
                    connectedEntity={connectedEntity}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Political/Diplomatic connections */}
          {political.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
                Political & Diplomatic ({political.length})
              </h2>
              <div className="space-y-3">
                {political.map(({ relationship, connectedEntity }) => (
                  <ConnectionCard
                    key={relationship.id}
                    relationship={relationship}
                    connectedEntity={connectedEntity}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Employment/Advisory */}
          {employment.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                Employment & Advisory ({employment.length})
              </h2>
              <div className="space-y-3">
                {employment.map(({ relationship, connectedEntity }) => (
                  <ConnectionCard
                    key={relationship.id}
                    relationship={relationship}
                    connectedEntity={connectedEntity}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Personal & Criminal */}
          {personal.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">
                Personal & Criminal ({personal.length})
              </h2>
              <div className="space-y-3">
                {personal.map(({ relationship, connectedEntity }) => (
                  <ConnectionCard
                    key={relationship.id}
                    relationship={relationship}
                    connectedEntity={connectedEntity}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Sources */}
          {allSources.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Sources ({allSources.length})
              </h2>
              <div className="space-y-2">
                {allSources.map((source) => {
                  const tierConfig = SOURCE_TIER_CONFIG[source.tier];
                  return (
                    <div
                      key={source.id}
                      className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg"
                    >
                      <span
                        className="mt-1 w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: tierConfig.color }}
                        title={tierConfig.label}
                      />
                      <div className="min-w-0">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 break-words"
                        >
                          {source.title}
                        </a>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {source.publisher} &middot; {source.date} &middot;{' '}
                          <span style={{ color: tierConfig.color }}>
                            {tierConfig.label}
                          </span>
                        </div>
                        {source.excerpt && (
                          <p className="text-xs text-gray-600 mt-1 italic">
                            {source.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Back links */}
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

function ConnectionCard({
  relationship,
  connectedEntity,
}: {
  relationship: any;
  connectedEntity: any;
}) {
  const color = VISUAL_COLORS[RELATION_TO_VISUAL[relationship.type as keyof typeof RELATION_TO_VISUAL]];
  const claimLabel = CLAIM_TYPE_LABELS[relationship.claim_type as keyof typeof CLAIM_TYPE_LABELS];
  const href =
    connectedEntity.type === 'person'
      ? `/person/${connectedEntity.slug}`
      : connectedEntity.type === 'country'
        ? `/country/${connectedEntity.slug}`
        : connectedEntity.type === 'organization' || connectedEntity.type === 'company'
          ? `/org/${connectedEntity.slug}`
          : null;

  const initials = connectedEntity.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2);

  const content = (
    <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
      {connectedEntity.photo_url ? (
        <img src={connectedEntity.photo_url} alt={connectedEntity.name} className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5">{initials}</div>
      )}
      <div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium text-white">{connectedEntity.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
            {claimLabel}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{relationship.description}</p>
        {relationship.amount_cents && (
          <span className="text-lg text-red-400 font-bold mt-1 inline-block">
            {formatAmount(relationship.amount_cents)}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
