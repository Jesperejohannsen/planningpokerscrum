import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { CLIENT_EVENTS, SERVER_EVENTS } from '../constants/events';
import type { Session } from '../types';

export interface UseSessionReturn {
  view: string;
  setView: (view: string) => void;
  sessionName: string;
  setSessionName: (name: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  session: Session | null;
  myVote: string | null;
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  createSession: () => void;
  joinSession: () => void;
  castVote: (vote: string) => void;
  revealVotes: () => void;
  hideVotes: () => void;
  resetVotes: () => void;
  updateStory: (story: string) => void;
}

export function useSession(
  socket: Socket | null,
  setError: (error: string | null) => void
): UseSessionReturn {
  const [view, setView] = useState('home');
  const [sessionName, setSessionName] = useState('');
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinSessionId = params.get('join');
    
    if (joinSessionId) {
      setSessionId(joinSessionId);
      setView('join');
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(SERVER_EVENTS.SESSION_CREATED, ({ sessionId: newSessionId, session: newSession }) => {
      setSessionId(newSessionId);
      setSession(newSession);
      setIsHost(true);
      setView('session');
      setError(null);
      
      window.history.pushState({}, '', `?session=${newSessionId}`);
    });

    socket.on(SERVER_EVENTS.SESSION_JOINED, ({ session: joinedSession }) => {
      setSession(joinedSession);
      setView('session');
      setError(null);
      
      window.history.pushState({}, '', `?session=${joinedSession.id}`);
    });

    socket.on(SERVER_EVENTS.SESSION_UPDATE, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
      
      if (socket.id && updatedSession.participants[socket.id]) {
        setMyVote(updatedSession.participants[socket.id].vote);
      }
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

    socket.on(SERVER_EVENTS.USER_DISCONNECTED, ({ session: updatedSession }: { session: Session }) => {
      setSession(updatedSession);
    });

    socket.on(SERVER_EVENTS.USER_REMOVED, ({ session: updatedSession, removedUserId, reason }: { 
      session: Session; 
      removedUserId: string; 
      reason: string;
    }) => {
      console.log(`User ${removedUserId} removed: ${reason}`);
      setSession(updatedSession);
      
    });

    socket.on(SERVER_EVENTS.HOST_CHANGED, ({ session: updatedSession, newHostId, newHostName }: { 
      session: Session; 
      newHostId: string; 
      newHostName: string;
    }) => {
      console.log(`New host: ${newHostName} (${newHostId})`);
      setSession(updatedSession);
      
      if (socket.id === newHostId) {
        setIsHost(true);
        console.log('🎉 You are now the host!');
      } else {
      }
    });

    socket.on(SERVER_EVENTS.ERROR, ({ message }) => {
      setError(message);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      socket.off(SERVER_EVENTS.SESSION_CREATED);
      socket.off(SERVER_EVENTS.SESSION_JOINED);
      socket.off(SERVER_EVENTS.SESSION_UPDATE);
      socket.off(SERVER_EVENTS.VOTE_UPDATE);
      socket.off(SERVER_EVENTS.VOTES_REVEALED);
      socket.off(SERVER_EVENTS.VOTES_HIDDEN);
      socket.off(SERVER_EVENTS.VOTES_RESET);
      socket.off(SERVER_EVENTS.STORY_UPDATE);
      socket.off(SERVER_EVENTS.USER_DISCONNECTED);
      socket.off(SERVER_EVENTS.USER_REMOVED);     
      socket.off(SERVER_EVENTS.HOST_CHANGED);     
      socket.off(SERVER_EVENTS.ERROR);
    };
  }, [socket, setError]);

  const createSession = () => {
    if (!socket || !sessionName.trim() || !userName.trim()) return;
    
    socket.emit(CLIENT_EVENTS.CREATE_SESSION, {
      sessionName: sessionName.trim(),
      userName: userName.trim()
    });
  };

  const joinSession = () => {
    if (!socket || !sessionId.trim() || !userName.trim()) return;
    
    socket.emit(CLIENT_EVENTS.JOIN_SESSION, {
      sessionId: sessionId.trim(),
      userName: userName.trim()
    });
  };

  const castVote = (vote: string) => {
    if (!socket || !sessionId) return;
    
    setMyVote(vote);
    socket.emit(CLIENT_EVENTS.CAST_VOTE, {
      sessionId,
      vote
    });
  };

  const revealVotes = () => {
    if (!socket || !sessionId) return;
    
    socket.emit(CLIENT_EVENTS.REVEAL_VOTES, { sessionId });
  };

  const hideVotes = () => {
    if (!socket || !sessionId) return;
    
    socket.emit(CLIENT_EVENTS.HIDE_VOTES, { sessionId });
  };

  const resetVotes = () => {
    if (!socket || !sessionId) return;
    
    socket.emit(CLIENT_EVENTS.RESET_VOTES, { sessionId });
  };

  const updateStory = (story: string) => {
    if (!socket || !sessionId) return;
    
    socket.emit(CLIENT_EVENTS.UPDATE_STORY, {
      sessionId,
      story
    });
  };

  return {
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
  };
}