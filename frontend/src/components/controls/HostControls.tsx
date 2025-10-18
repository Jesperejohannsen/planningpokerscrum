import { Eye, EyeOff, RotateCcw } from 'lucide-react';

interface HostControlsProps {
  votesRevealed: boolean;
  allVoted: boolean;
  participantsCount: number;
  votedCount: number;
  onRevealVotes: () => void;
  onHideVotes: () => void;
  onResetVotes: () => void;
}

export function HostControls({
  votesRevealed,
  allVoted,
  participantsCount,
  votedCount,
  onRevealVotes,
  onHideVotes,
  onResetVotes
}: HostControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={votesRevealed ? onHideVotes : onRevealVotes}
          disabled={!allVoted && !votesRevealed}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {votesRevealed ? (
            <>
              <EyeOff className="w-5 h-5" />
              Hide Votes
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              Reveal Votes
            </>
          )}
        </button>
        
        <button
          onClick={onResetVotes}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          <RotateCcw className="w-5 h-5" />
          New Round
        </button>
      </div>
      
      {!allVoted && !votesRevealed && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            Waiting for all participants to vote... ({votedCount}/{participantsCount})
          </p>
        </div>
      )}
    </div>
  );
}

export default HostControls;