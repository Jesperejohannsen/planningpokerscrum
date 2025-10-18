import type { Server, Socket } from 'socket.io';
import { sessionService } from '../../services/sessionService.js';
import type { CastVoteData, SessionActionData } from '../../types/index.js';
import { logger } from '../../utils/logger.js';
import { SERVER_EVENTS } from '../events.js';

export async function handleCastVote(
  socket: Socket,
  io: Server,
  { sessionId, vote }: CastVoteData
): Promise<void> {
  try {
    const session = await sessionService.castVote(sessionId, socket.id, vote);
    
    io.to(sessionId).emit(SERVER_EVENTS.VOTE_UPDATE, { session });
    
    logger.debug(`Vote cast in ${sessionId}: ${vote}`);
  } catch (error) {
    logger.error('Error in handleCastVote:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to cast vote' });
  }
}

export async function handleRevealVotes(
  socket: Socket,
  io: Server,
  { sessionId }: SessionActionData
): Promise<void> {
  try {
    const session = await sessionService.getSession(sessionId);
    
    if (!session) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Session not found' });
      return;
    }

    if (session.hostId !== socket.id) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Only host can reveal votes' });
      return;
    }

    const updatedSession = await sessionService.revealVotes(sessionId);
    
    io.to(sessionId).emit(SERVER_EVENTS.VOTES_REVEALED, { session: updatedSession });
    
    logger.info(`Votes revealed in ${sessionId}`);
  } catch (error) {
    logger.error('Error in handleRevealVotes:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to reveal votes' });
  }
}

export async function handleHideVotes(
  socket: Socket,
  io: Server,
  { sessionId }: SessionActionData
): Promise<void> {
  try {
    const session = await sessionService.getSession(sessionId);
    
    if (!session) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Session not found' });
      return;
    }

    if (session.hostId !== socket.id) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Only host can hide votes' });
      return;
    }

    const updatedSession = await sessionService.hideVotes(sessionId);
    
    io.to(sessionId).emit(SERVER_EVENTS.VOTES_HIDDEN, { session: updatedSession });
    
    logger.info(`Votes hidden in ${sessionId}`);
  } catch (error) {
    logger.error('Error in handleHideVotes:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to hide votes' });
  }
}

export async function handleResetVotes(
  socket: Socket,
  io: Server,
  { sessionId }: SessionActionData
): Promise<void> {
  try {
    const session = await sessionService.getSession(sessionId);
    
    if (!session) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Session not found' });
      return;
    }

    if (session.hostId !== socket.id) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Only host can reset votes' });
      return;
    }

    // ← ADD THIS DEBUG LOG
    console.log('🔄 Resetting votes. Current story:', session.currentStory);
    console.log('🔄 Votes revealed:', session.votesRevealed);
    console.log('🔄 History length before:', session.storyHistory?.length || 0);

    const updatedSession = await sessionService.resetVotes(sessionId);
    
    // ← ADD THIS DEBUG LOG
    console.log('✅ After reset. History length:', updatedSession.storyHistory?.length || 0);
    
    io.to(sessionId).emit(SERVER_EVENTS.VOTES_RESET, { session: updatedSession });
    
    logger.info(`Votes reset in ${sessionId}`);
  } catch (error) {
    logger.error('Error in handleResetVotes:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to reset votes' });
  }
}

export default {
  handleCastVote,
  handleRevealVotes,
  handleHideVotes,
  handleResetVotes
};