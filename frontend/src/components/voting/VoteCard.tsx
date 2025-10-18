interface VoteCardProps {
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  disabled: boolean;
}

export function VoteCard({ value, isSelected, onClick, disabled }: VoteCardProps) {
  return (
    <button
      onClick={() => onClick(value)}
      disabled={disabled}
      className={`
        aspect-[2/3] rounded-xl font-bold text-2xl transition-all duration-300 vote-card
        ${isSelected
          ? 'vote-card-selected text-white scale-110 border-2 border-neon-blue shadow-lg shadow-neon-blue/50'
          : 'glass text-gray-300 hover:text-white hover:border-neon-purple/50 border-2 border-white/10'
        }
        disabled:opacity-30 disabled:cursor-not-allowed
        relative overflow-hidden group
      `}
    >
      <span className="relative z-10">{value}</span>
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-purple/0 group-hover:from-neon-blue/10 group-hover:to-neon-purple/10 transition-all duration-300"></div>
      )}
    </button>
  );
}

export default VoteCard;