'use client';

import { useRouter } from 'next/navigation';
import { useGraphStore } from '@/store/graph-store';
import { getTrumpFamilyConnections, formatAmount } from '@/lib/data';
import { VISUAL_COLORS, RELATION_TO_VISUAL, TRUMP_FAMILY_IDS } from '@/lib/types';

const FAMILY_ORDER = TRUMP_FAMILY_IDS;

const DISPLAY_NAMES: Record<string, string> = {
  'e-donald-trump': 'Donald Trump',
  'e-melania-trump': 'Melania Trump',
  'e-eric-trump': 'Eric Trump',
  'e-don-jr': 'Donald Jr.',
  'e-barron-trump': 'Barron Trump',
};

export default function TrumpFamily() {
  const { selectNode, selectedNodeId } = useGraphStore();
  const router = useRouter();
  const familyData = getTrumpFamilyConnections();

  familyData.sort((a, b) =>
    FAMILY_ORDER.indexOf(a.member.id) - FAMILY_ORDER.indexOf(b.member.id)
  );

  return (
    <div className="flex-none bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 px-4 py-3">
      <div className="flex items-start gap-1 overflow-x-auto">
        <div className="shrink-0 mr-3 self-center">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Trump Family
          </h3>
        </div>
        {familyData.map(({ member, connections }) => {
          const isSelected = selectedNodeId === member.id;
          const isMelania = member.id === 'e-melania-trump';
          const initials = member.name.split(' ').map(p => p[0]).join('').slice(0, 2);
          const keyConnections = connections
            .filter(c => c.connectedEntity.id !== member.id)
            .filter(c => !FAMILY_ORDER.includes(c.connectedEntity.id))
            .slice(0, 3);

          const handleClick = () => {
            if (isMelania) {
              router.push('/melania');
            } else {
              selectNode(member.id);
            }
          };

          return (
            <button
              key={member.id}
              onClick={handleClick}
              className={`shrink-0 flex flex-col items-center p-2 rounded-lg transition-all min-w-[130px] ${
                isSelected
                  ? 'bg-orange-950/50 border border-orange-700/50'
                  : isMelania
                    ? 'hover:bg-pink-950/50 border border-transparent hover:border-pink-800/50'
                    : 'hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className={`w-12 h-12 rounded-full object-cover ${
                    member.id === 'e-donald-trump' ? 'ring-2 ring-orange-400/50' : 'ring-1 ring-gray-600'
                  }`}
                />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  member.id === 'e-donald-trump' ? 'bg-orange-600 ring-2 ring-orange-400/50'
                    : isMelania ? 'bg-pink-600 ring-2 ring-pink-400/50'
                    : 'bg-gray-700'
                }`}>
                  {initials}
                </div>
              )}
              <span className={`text-sm font-semibold mt-1.5 text-center leading-tight ${
                isMelania ? 'text-pink-400' : 'text-white'
              }`}>
                {DISPLAY_NAMES[member.id] || member.name}
              </span>
              <span className="text-xs text-gray-400 text-center leading-tight mt-0.5">
                {isMelania ? '$MELANIA Investigation' : member.role?.split('—')[0]?.trim().split(',')[0] || ''}
              </span>
              {/* Key connection chips */}
              {!isMelania && (
                <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                  {keyConnections.map(({ relationship, connectedEntity }) => (
                    <span
                      key={relationship.id}
                      className="text-[10px] px-1.5 py-0.5 rounded-full leading-none"
                      style={{
                        backgroundColor: VISUAL_COLORS[RELATION_TO_VISUAL[relationship.type]] + '22',
                        color: VISUAL_COLORS[RELATION_TO_VISUAL[relationship.type]],
                        borderWidth: 1,
                        borderColor: VISUAL_COLORS[RELATION_TO_VISUAL[relationship.type]] + '33',
                      }}
                      title={relationship.description}
                    >
                      {connectedEntity.name.split(' ').pop()}
                      {relationship.amount_cents ? ` ${formatAmount(relationship.amount_cents)}` : ''}
                    </span>
                  ))}
                </div>
              )}
              {isMelania && (
                <div className="flex gap-1 mt-1.5 justify-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full leading-none bg-pink-900/30 text-pink-400 border border-pink-800/30">
                    $65M extracted
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
