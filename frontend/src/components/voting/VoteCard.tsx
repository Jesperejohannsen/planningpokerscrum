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
        className={`aspect-[2/3] rounded-lg font-bold text-xl transition transform ${
          isSelected
            ? 'bg-indigo-600 text-white shadow-lg scale-105 ring-2 ring-indigo-400'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-102'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {value}
      </button>
    );
  }
  
  export default VoteCard;