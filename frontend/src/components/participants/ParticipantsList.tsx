import type { Participant } from '../../types';
import VoteStatistics from '../voting/VoteStatistics';
import { ParticipantCard } from './ParticipantCard';

interface ParticipantsListProps {
  participants: Participant[];
  votesRevealed: boolean;
}

export function ParticipantsList({ participants, votesRevealed }: ParticipantsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Participants ({participants.length})
        </h2>
        
        {votesRevealed && (
          <VoteStatistics participants={participants} />
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            votesRevealed={votesRevealed}
          />
        ))}
      </div>
    </div>
  );
}

export default ParticipantsList;