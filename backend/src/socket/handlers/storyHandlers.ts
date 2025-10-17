import type { Server, Socket } from 'socket.io';
import { sessionService } from '../../services/sessionService.js';
import type { UpdateStoryData } from '../../types/index.js';
import { logger } from '../../utils/logger.js';
import { SERVER_EVENTS } from '../events.js';

export async function handleUpdateStory(
  socket: Socket,
  io: Server,
  { sessionId, story }: UpdateStoryData
): Promise<void> {
  try {
    const session = await sessionService.getSession(sessionId);
    
    if (!session) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Session not found' });
      return;
    }

    if (session.hostId !== socket.id) {
      socket.emit(SERVER_EVENTS.ERROR, { message: 'Only host can update story' });
      return;
    }

    const updatedSession = await sessionService.updateStory(sessionId, story);
    
    io.to(sessionId).emit(SERVER_EVENTS.STORY_UPDATE, { session: updatedSession });
    
    logger.debug(`Story updated in ${sessionId}`);
  } catch (error) {
    logger.error('Error in handleUpdateStory:', error);
    socket.emit(SERVER_EVENTS.ERROR, { message: 'Failed to update story' });
  }
}

export default { handleUpdateStory };