import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { CLIENT_EVENTS, SERVER_EVENTS } from '../constants/events';
import type { Session, ViewType } from '../types';

interface UseSessionReturn {
  view: ViewType;
  setView: (view: ViewType) => void;
  sessionName: string;
  setSessionName: (name: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  sessionId: string;
  session: Session | null;
  myVote: string | null;
  isHost: boolean;
  createSession: () => void;
  joinSession: () => void;
  castVote: (vote: string) => void;
  revealVotes: () => void;
  hideVotes: () => void;
  resetVotes: () => void;
  updateStory: (story: string) => void;
}

/**
 * Custom hook for managing session state and socket events
 */
export function useSession(
  socket: Socket | null, 
  setError: (error: string) => void
): UseSessionReturn {
  const [view, setView] = useState<ViewType>('home');
  const [sessionName, setSessionName] = useState('');
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSessionId = params.get('session');
    if (urlSessionId) {
      setSessionId(urlSessionId);
      setView('join');
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(SERVER_EVENTS.SESSION_CREATED, ({ sessionId: newSessionId, session: newSession }: { sessionId: string; session: Session }) => {
      console.log('Session created:', newSessionId);
      setSessionId(newSessionId);
      setSession(newSession);
      setIsHost(true);
      setView('session');

      const url = new URL(window.location.href);
      url.searchParams.set('session', newSessionId);
      window.history.pushState({}, '', url.toString());
    });

    socket.on(SERVER_EVENTS.SESSION_JOINED, ({ session: newSession }: { session: Session }) => {
      console.log('Joined session:', newSession.id);
      setSession(newSession);
      setView('session');
    });

    socket.on(SERVER_EVENTS.PARTICIPANT_UPDATE, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
    });

    socket.on(SERVER_EVENTS.VOTE_UPDATE, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
    });

    socket.on(SERVER_EVENTS.VOTES_REVEALED, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
    });

    socket.on(SERVER_EVENTS.VOTES_HIDDEN, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
    });

    socket.on(SERVER_EVENTS.VOTES_RESET, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
      setMyVote(null);
    });

    socket.on(SERVER_EVENTS.STORY_UPDATE, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
    });

    socket.on(SERVER_EVENTS.ERROR, ({ message }: { message: string }) => {
      setError(message);
      setTimeout(() => setError(''), 5000);
    });

    return () => {
      socket.off(SERVER_EVENTS.SESSION_CREATED);
      socket.off(SERVER_EVENTS.SESSION_JOINED);
      socket.off(SERVER_EVENTS.PARTICIPANT_UPDATE);
      socket.off(SERVER_EVENTS.VOTE_UPDATE);
      socket.off(SERVER_EVENTS.VOTES_REVEALED);
      socket.off(SERVER_EVENTS.VOTES_HIDDEN);
      socket.off(SERVER_EVENTS.VOTES_RESET);
      socket.off(SERVER_EVENTS.STORY_UPDATE);
      socket.off(SERVER_EVENTS.ERROR);
    };
  }, [socket, setError]);

  const createSession = () => {
    if (!sessionName.trim() || !userName.trim()) return;
    socket?.emit(CLIENT_EVENTS.CREATE_SESSION, { sessionName, userName });
  };

  const joinSession = () => {
    if (!userName.trim()) return;
    socket?.emit(CLIENT_EVENTS.JOIN_SESSION, { sessionId, userName });
  };

  const castVote = (vote: string) => {
    setMyVote(vote);
    socket?.emit(CLIENT_EVENTS.CAST_VOTE, { sessionId, vote });
  };

  const revealVotes = () => {
    socket?.emit(CLIENT_EVENTS.REVEAL_VOTES, { sessionId });
  };

  const hideVotes = () => {
    socket?.emit(CLIENT_EVENTS.HIDE_VOTES, { sessionId });
  };

  const resetVotes = () => {
    socket?.emit(CLIENT_EVENTS.RESET_VOTES, { sessionId });
  };

  const updateStory = (story: string) => {
    socket?.emit(CLIENT_EVENTS.UPDATE_STORY, { sessionId, story });
  };

  return {
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
  };
}

export default useSession;