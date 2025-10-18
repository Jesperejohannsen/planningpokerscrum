import { ErrorNotification } from './components/layout/ErrorNotification';
import { useSession } from './hooks/useSession';
import { useSocket } from './hooks/useSocket';
import { CreateSessionView } from './views/CreateSessionView';
import { Home } from './views/Home';
import { JoinSessionView } from './views/JoinSessionView';
import { SessionView } from './views/SessionView';

export default function App() {
  const { socket, connected, error, setError } = useSocket();
  const sessionState = useSession(socket, setError);
  
  const {
    view,
    setView,
    sessionName,
    setSessionName,
    userName,
    setUserName,
    sessionId,
    session,
    myVote,
    isHost,
    createSession,
    joinSession,
    castVote,
    revealVotes,
    hideVotes,
    resetVotes,
    updateStory
  } = sessionState;

  if (view === 'home') {
    return (
      <>
        <Home 
          connected={connected} 
          onNavigate={setView}
          error={error}
        />
        <ErrorNotification error={error} />
      </>
    );
  }

  if (view === 'create') {
    return (
      <>
        <CreateSessionView
          sessionName={sessionName}
          setSessionName={setSessionName}
          userName={userName}
          setUserName={setUserName}
          onSubmit={createSession}
          onBack={() => setView('home')}
        />
        <ErrorNotification error={error} />
      </>
    );
  }

  if (view === 'join') {
    return (
      <>
        <JoinSessionView
          sessionId={sessionId}
          userName={userName}
          setUserName={setUserName}
          onSubmit={joinSession}
        />
        <ErrorNotification error={error} />
      </>
    );
  }

  if (view === 'session') {
    return (
      <>
        <SessionView
          session={session}
          sessionId={sessionId}
          isHost={isHost}
          myVote={myVote}
          connected={connected}
          onCastVote={castVote}
          onRevealVotes={revealVotes}
          onHideVotes={hideVotes}
          onResetVotes={resetVotes}
          onUpdateStory={updateStory}
        />
        <ErrorNotification error={error} />
      </>
    );
  }

  return null;
}