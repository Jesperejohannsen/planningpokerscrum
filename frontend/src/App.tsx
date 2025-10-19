import { useEffect } from 'react';
import { ErrorNotification } from './components/layout/ErrorNotification';
import { useSession } from './hooks/useSession';
import { useSocket } from './hooks/useSocket';
import { clearSession, loadSession, saveSession, updateLastActive } from './utils/sessionStorage';
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
    setSessionId,
    session,
    myVote,
    isHost,
    setIsHost,
    createSession,
    joinSession,
    castVote,
    revealVotes,
    hideVotes,
    resetVotes,
    updateStory
  } = sessionState;

  useEffect(() => {
    const storedSession = loadSession();
    
    if (storedSession && socket) {
      console.log('Found stored session, attempting to reconnect...', storedSession);
      
      setSessionId(storedSession.sessionId);
      setUserName(storedSession.userName);
      setIsHost(storedSession.isHost);
      
      socket.emit('joinSession', {
        sessionId: storedSession.sessionId,
        userName: storedSession.userName
      });
      
      setView('session');
    }
  }, [socket]); 

  useEffect(() => {
    if (view === 'session' && sessionId && userName) {
      saveSession({
        sessionId,
        userName,
        isHost,
        lastActive: Date.now()
      });
    }
  }, [sessionId, userName, isHost, view]);

  useEffect(() => {
    if (view === 'session') {
      const interval = setInterval(() => {
        updateLastActive();
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [view]);

  const handleLeaveSession = () => {
    clearSession();
    setView('home');
    setSessionId('');
    setUserName('');
    setIsHost(false);
    setSessionName('');
  };

  useEffect(() => {
    if (error && error.includes('not found')) {
      clearSession();
    }
  }, [error]);

  if (view === 'home') {
    return (
      <>
        <Home 
          connected={connected} 
          onNavigate={setView}
          error={error}
        />
        <ErrorNotification error={error || ''} />
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
        <ErrorNotification error={error ||  ''} />
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
          onBack={() => setView('home')}
        />
        <ErrorNotification error={error || ''} />
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
          onLeaveSession={handleLeaveSession}
        />
        <ErrorNotification error={error || ''} />
      </>
    );
  }

  return null;
}