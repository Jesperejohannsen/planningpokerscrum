import type { Socket } from 'socket.io';
import { sessionService } from '../../services/sessionService.js';
import type { CreateSessionData, JoinSessionData, Participant, Session } from '../../types/index.js';
import { logger } from '../../utils/logger.js';
import { generateSessionId } from '../../utils/sessionId.js';
import { SERVER_EVENTS } from '../events.js';

export async function handleCreateSession(
  socket: Socket,
  { sessionName, userName }: CreateSessionData,
  socketSessions: Map<string, string>
): Promise<void> {
  try {
    const sessionId = generateSessionId();
    
    const session: Session = {
      id: sessionId,
      name: sessionName,
      hostId: socket.id,
      currentStory: '',
      votesRevealed: false,
      participants: {
        [socket.id]: {
          id: socket.id,
          name: userName,
          vote: null,
          isHost: true,
          connected: true
        }
      },
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
    const session = await sessionService.getSession(sessionId);
    
    if (!session) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Session not found' });
      return;
    }

    const existingParticipant = Object.values(session.participants)
      .find(p => p.name === userName && !p.connected);

    if (existingParticipant) {
      delete session.participants[existingParticipant.id];
      existingParticipant.id = socket.id;
      existingParticipant.connected = true;
      session.participants[socket.id] = existingParticipant;
    } else {
      const newParticipant: Participant = {
        id: socket.id,
        name: userName,
        vote: null,
        isHost: false,
        connected: true
      };
      session.participants[socket.id] = newParticipant;
    }

    const updatedSession = await sessionService.updateSession(sessionId, session);
    
    socket.join(sessionId);
    socketSessions.set(socket.id, sessionId);

    socket.emit(SERVER_EVENTS.SESSION_JOINED, { session: updatedSession });
    socket.to(sessionId).emit(SERVER_EVENTS.PARTICIPANT_UPDATE, { session: updatedSession });
    
    logger.info(`${userName} joined session ${sessionId}`);
  } catch (error) {
    logger.error('Error in handleJoinSession:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to join session' });
  }
}

export async function handleDisconnect(
  socket: Socket,
  socketSessions: Map<string, string>
): Promise<void> {
  const sessionId = socketSessions.get(socket.id);
  
  if (sessionId) {
    try {
      const session = await sessionService.getSession(sessionId);
      
      if (session && session.participants[socket.id]) {
        const updatedSession = await sessionService.updateParticipant(
          sessionId,
          socket.id,
          { connected: false }
        );
        
        socket.to(sessionId).emit(SERVER_EVENTS.PARTICIPANT_UPDATE, { session: updatedSession });
        
        logger.info(`Participant ${socket.id} disconnected from session ${sessionId}`);
      }
    } catch (error) {
      logger.error('Error in handleDisconnect:', error);
    }
    
    socketSessions.delete(socket.id);
  }
}

export default {
  handleCreateSession,
  handleJoinSession,
  handleDisconnect
};