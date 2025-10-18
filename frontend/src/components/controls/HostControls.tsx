import { Eye, EyeOff, RotateCcw, Zap } from 'lucide-react';

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
    <div className="cyber-card rounded-2xl p-6 animate-slide-up">
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={votesRevealed ? onHideVotes : onRevealVotes}
          disabled={!allVoted && !votesRevealed}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-gradient-to-r from-neon-green to-emerald-500 text-dark-900 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed neon-button shadow-lg hover:shadow-neon-green/50"
        >
          {votesRevealed ? (
            <>
              <EyeOff className="w-6 h-6" />
              Hide Votes
            </>
          ) : (
            <>
              <Eye className="w-6 h-6" />
              <Zap className="w-4 h-4" />
              Reveal Votes
            </>
          )}
        </button>
        
        <button
          onClick={onResetVotes}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-3 glass text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 border-2 border-white/10 hover:border-neon-purple/50 neon-button"
        >
          <RotateCcw className="w-6 h-6" />
          New Round
        </button>
      </div>
      
      {!allVoted && !votesRevealed && (
        <div className="mt-4 p-4 glass rounded-xl border border-neon-yellow/30">
          <p className="text-sm text-neon-yellow text-center flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse"></div>
            Waiting for votes... ({votedCount}/{participantsCount})
          </p>
        </div>
      )}
    </div>
  );
}

export default HostControls;