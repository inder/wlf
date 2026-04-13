'use client';

import Link from 'next/link';
import { useGraphStore } from '@/store/graph-store';
import { getEntityById, getEntityConnections, formatAmount } from '@/lib/data';
import { VISUAL_COLORS, RELATION_TO_VISUAL, CLAIM_TYPE_LABELS, COUNTRY_FLAGS } from '@/lib/types';

function EntityAvatar({ entity, size = 14 }: { entity: any; size?: number }) {
  const sizeClass = size === 14 ? 'w-14 h-14' : 'w-8 h-8';
  const textSize = size === 14 ? 'text-xl' : 'text-xs';

  if (entity.photo_url) {
    return (
      <img
        src={entity.photo_url}
        alt={entity.name}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  if (entity.type === 'country' && COUNTRY_FLAGS[entity.id]) {
    return (
      <div className={`${sizeClass} rounded-full bg-gray-700 flex items-center justify-center ${size === 14 ? 'text-2xl' : 'text-base'}`}>
        {COUNTRY_FLAGS[entity.id]}
      </div>
    );
  }

  const initials = entity.name
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2);

  return (
    <div className={`${sizeClass} rounded-full bg-gray-700 flex items-center justify-center ${textSize} font-bold text-white`}>
      {initials}
    </div>
  );
}

export default function Sidebar() {
  const { selectedNodeId, selectNode } = useGraphStore();

  if (!selectedNodeId) return null;

  const entity = getEntityById(selectedNodeId);
  if (!entity) return null;

  const connections = getEntityConnections(selectedNodeId);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => selectNode(null)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[40%] lg:w-[35%] bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto">
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={() => selectNode(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          >
            x
          </button>

          {/* Entity header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <EntityAvatar entity={entity} size={14} />
              <div>
                <h2 className="text-xl font-bold text-white">{entity.name}</h2>
                {entity.role && (
                  <p className="text-sm text-gray-400">{entity.role}</p>
                )}
              </div>
            </div>
            <p className="text-orange-400 font-medium text-sm mt-2">
              {entity.one_liner}
            </p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">{entity.bio}</p>
          </div>

          {/* Connections */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Connections ({connections.length})
            </h3>
            <div className="space-y-2">
              {connections.slice(0, 15).map(({ relationship, connectedEntity }) => (
                <button
                  key={relationship.id}
                  onClick={() => selectNode(connectedEntity.id)}
                  className="w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <EntityAvatar entity={connectedEntity} size={8} />
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          VISUAL_COLORS[RELATION_TO_VISUAL[relationship.type]],
                      }}
                    />
                    <span className="text-white text-sm font-medium">
                      {connectedEntity.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {CLAIM_TYPE_LABELS[relationship.claim_type]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 pl-12">
                    {relationship.description}
                    {relationship.amount_cents && (
                      <span className="text-red-400 font-bold ml-1 text-sm">
                        ({formatAmount(relationship.amount_cents)})
                      </span>
                    )}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* View full dossier */}
          {entity.type === 'person' && (
            <Link
              href={`/person/${entity.slug}`}
              className="block w-full text-center py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors"
            >
              View Full Dossier
            </Link>
          )}
          {entity.type === 'country' && (
            <Link
              href={`/country/${entity.slug}`}
              className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
            >
              View Country Page
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
