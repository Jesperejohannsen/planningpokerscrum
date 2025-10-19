import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { sessionService } from './services/sessionService.js';
import { CLIENT_EVENTS } from './socket/events.js';
import { handleCreateSession, handleDisconnect, handleJoinSession } from './socket/handlers/sessionHandlers.js';
import { handleUpdateStory } from './socket/handlers/storyHandlers.js';
import { handleCastVote, handleHideVotes, handleResetVotes, handleRevealVotes } from './socket/handlers/voteHandlers.js';
import type {
  CastVoteData,
  CreateSessionData,
  JoinSessionData,
  SessionActionData,
  UpdateStoryData
} from './types/index.js';
import { logger } from './utils/logger.js';

const app = express();
const httpServer = createServer(app);

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.CLIENT_URL || 'https://your-production-domain.com',
    ]
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174'
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const socketSessions = new Map<string, string>();

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on(CLIENT_EVENTS.CREATE_SESSION, (data: CreateSessionData) => {
    handleCreateSession(socket, data, socketSessions);
  });

  socket.on(CLIENT_EVENTS.JOIN_SESSION, (data: JoinSessionData) => {
    handleJoinSession(socket, data, socketSessions);
  });

  socket.on(CLIENT_EVENTS.CAST_VOTE, (data: CastVoteData) => {
    handleCastVote(socket, io, data);
  });

  socket.on(CLIENT_EVENTS.REVEAL_VOTES, (data: SessionActionData) => {
    handleRevealVotes(socket, io, data);
  });

  socket.on(CLIENT_EVENTS.HIDE_VOTES, (data: SessionActionData) => {
    handleHideVotes(socket, io, data);
  });

  socket.on(CLIENT_EVENTS.RESET_VOTES, (data: SessionActionData) => {
    handleResetVotes(socket, io, data);
  });

  socket.on(CLIENT_EVENTS.UPDATE_STORY, (data: UpdateStoryData) => {
    handleUpdateStory(socket, io, data);
  });

  socket.on(CLIENT_EVENTS.DISCONNECT, () => {
    handleDisconnect(socket, socketSessions);
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

app.get('/api/session/:id', async (req, res) => {
  try {
    const session = await sessionService.getSession(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    logger.error('Error fetching session:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export { app, httpServer, io };
export default app;