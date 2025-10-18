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
      <span className="text-gray-600">
        Avg: <span className="font-bold text-indigo-600">{stats.average}</span>
      </span>
      <span className="text-gray-600">
        Median: <span className="font-bold text-indigo-600">{stats.median}</span>
      </span>
      {stats.min !== stats.max && (
        <>
          <span className="text-gray-600">
            Min: <span className="font-bold text-indigo-600">{stats.min}</span>
          </span>
          <span className="text-gray-600">
            Max: <span className="font-bold text-indigo-600">{stats.max}</span>
          </span>
        </>
      )}
    </div>
  );
}

export default VoteStatistics;