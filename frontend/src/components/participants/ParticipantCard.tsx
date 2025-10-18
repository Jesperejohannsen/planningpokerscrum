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
    if (participant.vote === null) return 'text-gray-300';
    return votesRevealed ? 'text-indigo-600' : 'text-green-600';
  };

  return (
    <div
      className={`p-4 border-2 rounded-lg text-center transition ${
        participant.connected 
          ? 'border-gray-200 bg-white' 
          : 'border-gray-100 bg-gray-50 opacity-60'
      }`}
    >
      <div className="font-medium text-gray-800 mb-2 text-sm truncate">
        {participant.name}
        {participant.isHost && (
          <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
            Host
          </span>
        )}
      </div>
      
      <div className={`text-3xl font-bold ${getVoteColor()}`}>
        {getVoteDisplay()}
      </div>
      
      {!participant.connected && (
        <div className="text-xs text-red-500 mt-1">Disconnected</div>
      )}
    </div>
  );
}

export default ParticipantCard;