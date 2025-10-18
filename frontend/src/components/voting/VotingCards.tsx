import { Hand } from 'lucide-react';
import { CARD_VALUES } from '../../constants/cardValues';
import { VoteCard } from './VoteCard';

interface VotingCardsProps {
  myVote: string | null;
  onCastVote: (vote: string) => void;
  connected: boolean;
}

export function VotingCards({ myVote, onCastVote, connected }: VotingCardsProps) {
  return (
    <div className="cyber-card rounded-2xl shadow-2xl p-6 mb-6 animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg">
          <Hand className="w-5 h-5 text-white" />
        </div>
        Your Vote
      </h2>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
        {CARD_VALUES.map((value) => (
          <VoteCard
            key={value}
            value={value}
            isSelected={myVote === value}
            onClick={onCastVote}
            disabled={!connected}
          />
        ))}
      </div>
    </div>
  );
}

export default VotingCards;