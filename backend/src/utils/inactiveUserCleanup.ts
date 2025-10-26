import type { Server } from 'socket.io';
import { sessionService } from '../services/sessionService.js';
import { SERVER_EVENTS } from '../socket/events.js';
import { logger } from './logger.js';

const INACTIVE_TIMEOUT = 10 * 60 * 1000;
const CLEANUP_INTERVAL = 60 * 1000;

interface DisconnectionTracker {
  [sessionId: string]: {
    [participantId: string]: number; 
  };
}

const disconnectionTimes: DisconnectionTracker = {};

export function trackDisconnection(sessionId: string, participantId: string): void {
  if (!disconnectionTimes[sessionId]) {
    disconnectionTimes[sessionId] = {};
  }
  disconnectionTimes[sessionId][participantId] = Date.now();
  logger.debug(`Tracking disconnection for ${participantId} in session ${sessionId}`);
}

export function clearDisconnectionTracking(sessionId: string, participantId: string): void {
  if (disconnectionTimes[sessionId]) {
    delete disconnectionTimes[sessionId][participantId];
    logger.debug(`Cleared disconnection tracking for ${participantId}`);
  }
}

async function promoteNewHost(sessionId: string, io: Server): Promise<void> {
  const session = await sessionService.getSession(sessionId);
  if (!session) return;

  const connectedParticipants = Object.values(session.participants)
    .filter(p => p.connected)
    .sort((a, b) => {
      return a.id.localeCompare(b.id);
    });

  if (connectedParticipants.length > 0) {
    const newHost = connectedParticipants[0];
    session.hostId = newHost.id;
    session.participants[newHost.id].isHost = true;

    await sessionService.updateSession(sessionId, session);

    io.to(sessionId).emit(SERVER_EVENTS.HOST_CHANGED, { 
      session,
      newHostId: newHost.id,
      newHostName: newHost.name
    });

    logger.info(`New host promoted in session ${sessionId}: ${newHost.name} (${newHost.id})`);
  } else {
    logger.info(`No connected participants left in session ${sessionId}`);
  }
}

async function cleanupInactiveUsers(io: Server): Promise<void> {
  const now = Date.now();

  for (const [sessionId, participants] of Object.entries(disconnectionTimes)) {
    const session = await sessionService.getSession(sessionId);
    if (!session) {
      delete disconnectionTimes[sessionId];
      continue;
    }

    for (const [participantId, disconnectedAt] of Object.entries(participants)) {
      const inactiveTime = now - disconnectedAt;

      if (inactiveTime >= INACTIVE_TIMEOUT) {
        logger.info(`Removing inactive user ${participantId} from session ${sessionId} (inactive for ${Math.round(inactiveTime / 1000 / 60)} minutes)`);

        const wasHost = session.hostId === participantId;

        delete session.participants[participantId];
        delete disconnectionTimes[sessionId][participantId];

        await sessionService.updateSession(sessionId, session);

        io.to(sessionId).emit(SERVER_EVENTS.USER_REMOVED, { 
          session,
          removedUserId: participantId,
          reason: 'inactive'
        });

        if (wasHost) {
          logger.info(`Removed user was host, promoting new host...`);
          await promoteNewHost(sessionId, io);
        }
      }
    }

    if (Object.keys(disconnectionTimes[sessionId]).length === 0) {
      delete disconnectionTimes[sessionId];
    }
  }
}

export function startInactiveUserCleanup(io: Server): NodeJS.Timeout {
  logger.info(`Starting inactive user cleanup service (timeout: ${INACTIVE_TIMEOUT / 1000 / 60} minutes)`);
  
  const interval = setInterval(() => {
    cleanupInactiveUsers(io).catch(error => {
      logger.error('Error in inactive user cleanup:', error);
    });
  }, CLEANUP_INTERVAL);

  return interval;
}

export function stopInactiveUserCleanup(interval: NodeJS.Timeout): void {
  clearInterval(interval);
  logger.info('Stopped inactive user cleanup service');
}

export default {
  trackDisconnection,
  clearDisconnectionTracking,
  startInactiveUserCleanup,
  stopInactiveUserCleanup
};