import { Users } from 'lucide-react';
import type { Participant } from '../../types';
import { VoteStatistics } from '../voting/VoteStatistics';
import { ParticipantCard } from './ParticipantCard';

interface ParticipantsListProps {
  participants: Participant[];
  votesRevealed: boolean;
}

export function ParticipantsList({ participants, votesRevealed }: ParticipantsListProps) {
  return (
    <div className="cyber-card rounded-2xl shadow-2xl p-6 mb-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          Participants
          <span className="text-lg text-gray-500">({participants.length})</span>
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