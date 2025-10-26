import type { Socket } from 'socket.io';
import { createSessionLimiter, joinSessionLimiter } from '../../middleware/rateLimiter.js';
import { validateSessionName, validateUsername } from '../../middleware/validation.js';
import { sessionService } from '../../services/sessionService.js';
import type { CreateSessionData, JoinSessionData, Session } from '../../types/index.js';
import { clearDisconnectionTracking, trackDisconnection } from '../../utils/inactiveUserCleanup.js';
import { logger } from '../../utils/logger.js';
import { generateSessionId } from '../../utils/sessionId.js';
import { SERVER_EVENTS } from '../events.js';

export async function handleCreateSession(
  socket: Socket,
  { sessionName, userName }: CreateSessionData,
  socketSessions: Map<string, string>
): Promise<void> {
  try {
    if (!createSessionLimiter.isAllowed(socket.id)) {
      socket.emit(SERVER_EVENTS.ERROR, { 
        message: 'Too many sessions created. Please wait a moment.' 
      });
      return;
    }

    const sessionValidation = validateSessionName(sessionName);
    if (!sessionValidation.isValid) {
      socket.emit(SERVER_EVENTS.ERROR, { message: sessionValidation.error });
      return;
    }

    const userValidation = validateUsername(userName);
    if (!userValidation.isValid) {
      socket.emit(SERVER_EVENTS.ERROR, { message: userValidation.error });
      return;
    }

    const sessionId = generateSessionId();
    
    const session: Session = {
      id: sessionId,
      name: sessionName.trim(),
      hostId: socket.id,
      currentStory: '',
      votesRevealed: false,
      participants: {
        [socket.id]: {
          id: socket.id,
          name: userName.trim(),
          vote: null,
          isHost: true,
          connected: true
        }
      },
      storyHistory: [],
      createdAt: Date.now()
    };

    await sessionService.createSession(sessionId, session);
    
    socket.join(sessionId);
    socketSessions.set(socket.id, sessionId);

    socket.emit(SERVER_EVENTS.SESSION_CREATED, { sessionId, session });
    
    logger.info(`Session ${sessionId} created by ${userName}`);
  } catch (error) {
    logger.error('Error in handleCreateSession:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to create session' });
  }
}

export async function handleJoinSession(
  socket: Socket,
  { sessionId, userName }: JoinSessionData,
  socketSessions: Map<string, string>
): Promise<void> {
  try {
    if (!joinSessionLimiter.isAllowed(socket.id)) {
      socket.emit(SERVER_EVENTS.ERROR, { 
        message: 'Too many join attempts. Please wait a moment.' 
      });
      return;
    }

    const validation = validateUsername(userName);
    if (!validation.isValid) {
      socket.emit(SERVER_EVENTS.ERROR, { message: validation.error });
      return;
    }

    const session = await sessionService.getSession(sessionId);
    
    if (!session) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Session not found' });
      return;
    }

    const existingParticipant = Object.values(session.participants)
      .find(p => p.name.toLowerCase() === userName.trim().toLowerCase());

    if (existingParticipant) {
      if (!existingParticipant.connected) {
        delete session.participants[existingParticipant.id];
        
        session.participants[socket.id] = {
          id: socket.id,
          name: userName.trim(),
          vote: existingParticipant.vote, 
          isHost: existingParticipant.isHost,
          connected: true
        };

        clearDisconnectionTracking(sessionId, existingParticipant.id);
        
        await sessionService.updateSession(sessionId, session);
        
        socket.join(sessionId);
        socketSessions.set(socket.id, sessionId);

        socket.emit(SERVER_EVENTS.SESSION_JOINED, { session });
        socket.to(sessionId).emit(SERVER_EVENTS.SESSION_UPDATE, { session });
        
        logger.info(`User ${userName} reconnected to session ${sessionId}`);
        return; 
      } else {
        socket.emit(SERVER_EVENTS.ERROR, { 
          message: 'This username is already taken in this session. Please choose another name.' 
        });
        return;
      }
    }

    session.participants[socket.id] = {
      id: socket.id,
      name: userName.trim(),
      vote: null,
      isHost: false,
      connected: true
    };
    
    await sessionService.updateSession(sessionId, session);
    
    socket.join(sessionId);
    socketSessions.set(socket.id, sessionId);

    socket.emit(SERVER_EVENTS.SESSION_JOINED, { session });
    socket.to(sessionId).emit(SERVER_EVENTS.SESSION_UPDATE, { session });
    
    logger.info(`User ${userName} joined session ${sessionId}`);
  } catch (error) {
    logger.error('Error in handleJoinSession:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to join session' });
  }
}

export async function handleDisconnect(
  socket: Socket,
  socketSessions: Map<string, string>
): Promise<void> {
  try {
    const sessionId = socketSessions.get(socket.id);
    
    if (sessionId) {
      const session = await sessionService.getSession(sessionId);
      
      if (session && session.participants[socket.id]) {
        session.participants[socket.id].connected = false;
        
        trackDisconnection(sessionId, socket.id);
        
        await sessionService.updateSession(sessionId, session);
        
        socket.to(sessionId).emit(SERVER_EVENTS.USER_DISCONNECTED, { session });
        
        logger.info(`User disconnected from session ${sessionId}`);
      }
    }
    
    socketSessions.delete(socket.id);
  } catch (error) {
    logger.error('Error in handleDisconnect:', error);
  }
}

export default {
  handleCreateSession,
  handleJoinSession,
  handleDisconnect
};