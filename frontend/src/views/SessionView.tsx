import { HostControls } from '../components/controls/HostControls';
import { ParticipantsList } from '../components/participants/ParticipantsList';
import { SessionHeader } from '../components/session/SessionHeader';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Loading session...</div>
      </div>
    );
  }

  const participants = Object.values(session.participants);
  const allVoted = participants.every(p => p.vote !== null);
  const votesRevealed = session.votesRevealed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
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
      </div>
    </div>
  );
}

export default SessionView;