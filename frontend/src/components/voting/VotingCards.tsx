import { CARD_VALUES } from '../../constants/cardValues';
import { VoteCard } from './VoteCard';

interface VotingCardsProps {
  myVote: string | null;
  onCastVote: (vote: string) => void;
  connected: boolean;
}

export function VotingCards({ myVote, onCastVote, connected }: VotingCardsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Vote</h2>
      
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