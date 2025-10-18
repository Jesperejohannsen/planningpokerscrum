import { ArrowDown, ArrowUp, Target, TrendingUp } from 'lucide-react';
import type { Participant } from '../../types';
import { calculateVoteStats } from '../../utils/voteStatistics';

interface VoteStatisticsProps {
  participants: Participant[];
}

export function VoteStatistics({ participants }: VoteStatisticsProps) {
  const stats = calculateVoteStats(participants, true);

  if (!stats) return null;

  return (
    <div className="flex gap-4 text-sm">
      <div className="glass px-3 py-2 rounded-lg border border-neon-blue/30 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-neon-blue" />
        <span className="text-gray-400">Avg:</span>
        <span className="font-bold text-neon-blue">{stats.average}</span>
      </div>
      <div className="glass px-3 py-2 rounded-lg border border-neon-purple/30 flex items-center gap-2">
        <Target className="w-4 h-4 text-neon-purple" />
        <span className="text-gray-400">Median:</span>
        <span className="font-bold text-neon-purple">{stats.median}</span>
      </div>
      {stats.min !== stats.max && (
        <>
          <div className="glass px-3 py-2 rounded-lg border border-neon-green/30 flex items-center gap-2">
            <ArrowDown className="w-4 h-4 text-neon-green" />
            <span className="text-gray-400">Min:</span>
            <span className="font-bold text-neon-green">{stats.min}</span>
          </div>
          <div className="glass px-3 py-2 rounded-lg border border-neon-pink/30 flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-neon-pink" />
            <span className="text-gray-400">Max:</span>
            <span className="font-bold text-neon-pink">{stats.max}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default VoteStatistics;