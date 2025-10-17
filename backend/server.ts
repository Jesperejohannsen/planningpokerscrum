import redis from '../backend/src/config/redis.ts';
import { logger } from '../backend/src/utils/logger.ts';
import { httpServer } from './app.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

function gracefulShutdown(signal: string): void {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  httpServer.close(() => {
    logger.info('HTTP server closed');
    
    redis.quit(() => {
      logger.info('Redis connection closed');
      process.exit(0);
    });
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

httpServer.listen(PORT, () => {
  logger.info(`🚀 Planning Poker server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

httpServer.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  } else {
    logger.error('Server error:', error);
  }
  process.exit(1);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});