import { HostControls } from '../components/controls/HostControls';
import { ParticipantsList } from '../components/participants/ParticipantsList';
import { SessionHeader } from '../components/session/SessionHeader';
import StoryHistory from '../components/session/StoryHistory';
import { VotingCards } from '../components/voting/VotingCards';
import type { Session } from '../types';

interface SessionViewProps {
  session: Session | null;
  sessionId: string;
  isHost: boolean;
  myVote: string | null;
  connected: boolean;
  onCastVote: (vote: string) => void;
  onRevealVotes: () => void;
  onHideVotes: () => void;
  onResetVotes: () => void;
  onUpdateStory: (story: string) => void;
}

export function SessionView({
  session,
  sessionId,
  isHost,
  myVote,
  connected,
  onCastVote,
  onRevealVotes,
  onHideVotes,
  onResetVotes,
  onUpdateStory
}: SessionViewProps) {
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 bg-cyber-grid flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-neon-purple rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-3 h-3 bg-neon-pink rounded-full animate-pulse animation-delay-400"></div>
            <span className="text-gray-400 ml-2">Loading session...</span>
          </div>
        </div>
      </div>
    );
  }

  console.log('=== SESSION DEBUG ===');
  console.log('Full session:', session);
  console.log('storyHistory:', session.storyHistory);
  console.log('storyHistory type:', typeof session.storyHistory);
  console.log('storyHistory length:', session.storyHistory?.length);
  console.log('===================');

  const participants = Object.values(session.participants);
  const allVoted = participants.every(p => p.vote !== null);
  const votesRevealed = session.votesRevealed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 bg-cyber-grid p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue opacity-5 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple opacity-5 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SessionHeader
          session={session}
          sessionId={sessionId}
          isHost={isHost}
          connected={connected}
          onUpdateStory={onUpdateStory}
        />

        <ParticipantsList
          participants={participants}
          votesRevealed={votesRevealed}
        />

        <VotingCards
          myVote={myVote}
          onCastVote={onCastVote}
          connected={connected}
        />

        {isHost && (
          <HostControls
            votesRevealed={votesRevealed}
            allVoted={allVoted}
            participantsCount={participants.length}
            votedCount={participants.filter(p => p.vote !== null).length}
            onRevealVotes={onRevealVotes}
            onHideVotes={onHideVotes}
            onResetVotes={onResetVotes}
          />
        )}

       {/* Story History - Shows for everyone */}
        {session.storyHistory && session.storyHistory.length > 0 && (
          <StoryHistory history={session.storyHistory} />
        )}
      </div>
    </div>
  );
}

export default SessionView;