import type { Participant, VoteStatistics } from '../types';

/**
 * Calculate vote statistics
 */
export function calculateVoteStats(
  participants: Participant[], 
  votesRevealed: boolean
): VoteStatistics | null {
  if (!votesRevealed || !participants) return null;

  const votes = participants
    .map(p => p.vote)
    .filter((v): v is string => v !== null && v !== '?' && v !== '☕')
    .map(Number)
    .filter(v => !isNaN(v));

  if (votes.length === 0) return null;

  const sum = votes.reduce((a, b) => a + b, 0);
  const average = sum / votes.length;

  const sorted = [...votes].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const min = Math.min(...votes);
  const max = Math.max(...votes);

  return {
    average: average.toFixed(1),
    median,
    min,
    max,
    count: votes.length
  };
}

export default calculateVoteStats;