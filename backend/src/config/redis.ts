import { Redis } from 'ioredis';
import { logger } from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, { // Use the imported module as a constructor
  retryStrategy: (times: number): number | null => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError: (err: Error): boolean => {
    logger.error('Redis reconnect on error:', err);
    return true;
  }
});

redis.on('connect', () => {
  logger.info('✅ Redis connected');
});

redis.on('error', (err: Error) => {
  logger.error('❌ Redis error:', err);
});

redis.on('ready', () => {
  logger.info('✅ Redis ready');
});

redis.on('reconnecting', () => {
  logger.warn('🔄 Redis reconnecting...');
});

export const SESSION_TTL = parseInt(process.env.SESSION_TTL || '86400', 10);

export default redis;