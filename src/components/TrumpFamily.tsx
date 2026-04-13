'use client';

import { useGraphStore } from '@/store/graph-store';
import { getTrumpFamilyConnections, formatAmount } from '@/lib/data';
import { VISUAL_COLORS, RELATION_TO_VISUAL } from '@/lib/types';

const FAMILY_ORDER = ['e-donald-trump', 'e-eric-trump', 'e-don-jr', 'e-barron-trump'];

export default function TrumpFamily() {
  const { selectNode, selectedNodeId } = useGraphStore();
  const familyData = getTrumpFamilyConnections();

  // Sort by our preferred order
  familyData.sort((a, b) =>
    FAMILY_ORDER.indexOf(a.member.id) - FAMILY_ORDER.indexOf(b.member.id)
  );

  return (
    <div className="flex-none bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 px-4 py-3">
      <div className="flex items-start gap-1 overflow-x-auto">
        <div className="shrink-0 mr-3 self-center">
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Trump Family
          </h3>
        </div>
        {familyData.map(({ member, connections }) => {
          const isSelected = selectedNodeId === member.id;
          const initials = member.name.split(' ').map(p => p[0]).join('').slice(0, 2);
          const keyConnections = connections
            .filter(c => c.connectedEntity.id !== member.id)
            .filter(c => !FAMILY_ORDER.includes(c.connectedEntity.id))
            .slice(0, 3);

          return (
            <button
              key={member.id}
              onClick={() => selectNode(member.id)}
              className={`shrink-0 flex flex-col items-center p-2 rounded-lg transition-all min-w-[110px] ${
                isSelected
                  ? 'bg-orange-950/50 border border-orange-700/50'
                  : 'hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                member.id === 'e-donald-trump' ? 'bg-orange-600 ring-2 ring-orange-400/50' : 'bg-gray-700'
              }`}>
                {initials}
              </div>
              <span className="text-[11px] font-semibold text-white mt-1 text-center leading-tight">
                {member.name.split(' ').pop()}
              </span>
              <span className="text-[9px] text-gray-500 text-center leading-tight mt-0.5">
                {member.role?.split('—')[0]?.trim().split(',')[0] || ''}
              </span>
              {/* Key connection chips */}
              <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                {keyConnections.map(({ relationship, connectedEntity }) => (
                  <span
                    key={relationship.id}
                    className="text-[7px] px-1 py-0.5 rounded-full leading-none"
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
