import type { Participant } from '../../types';

interface ParticipantCardProps {
  participant: Participant;
  votesRevealed: boolean;
}

export function ParticipantCard({ participant, votesRevealed }: ParticipantCardProps) {
  const getVoteDisplay = () => {
    if (participant.vote === null) return '—';
    return votesRevealed ? participant.vote : '✓';
  };

  const getVoteColor = () => {
    if (participant.vote === null) return 'text-gray-600';
    return votesRevealed ? 'text-neon-blue' : 'text-neon-green';
  };

  return (
    <div
      className={`
        cyber-card rounded-xl p-4 text-center transition-all duration-300 hover:scale-105
        ${participant.connected 
          ? 'opacity-100' 
          : 'opacity-40'
        }
      `}
    >
      <div className="font-medium text-gray-300 mb-3 text-sm truncate">
        {participant.name}
        {participant.isHost && (
          <span className="ml-2 text-xs bg-gradient-to-r from-neon-purple to-neon-pink px-2 py-1 rounded-full text-white">
            👑 Host
          </span>
        )}
      </div>
      
      <div className={`text-4xl font-bold ${getVoteColor()} ${votesRevealed && participant.vote ? 'animate-glow' : ''}`}>
        {getVoteDisplay()}
      </div>
      
      {!participant.connected && (
        <div className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Offline
        </div>
      )}
    </div>
  );
}

export default ParticipantCard;