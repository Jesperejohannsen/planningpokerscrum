/**
 * Rate limiter to prevent abuse
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
  }
  
  class RateLimiter {
    private limits: Map<string, RateLimitEntry> = new Map();
    private readonly maxRequests: number;
    private readonly windowMs: number;
  
    constructor(maxRequests: number = 10, windowMs: number = 60000) {
      this.maxRequests = maxRequests;
      this.windowMs = windowMs;
      
      // Cleanup old entries every minute
      setInterval(() => this.cleanup(), 60000);
    }
  
    /**
     * Check if request is allowed for this identifier
     */
    isAllowed(identifier: string): boolean {
      const now = Date.now();
      const entry = this.limits.get(identifier);
  
      if (!entry || entry.resetAt < now) {
        // New window
        this.limits.set(identifier, {
          count: 1,
          resetAt: now + this.windowMs
        });
        return true;
      }
  
      if (entry.count >= this.maxRequests) {
        // Rate limit exceeded
        return false;
      }
  
      // Increment count
      entry.count++;
      return true;
    }
  
    /**
     * Get remaining requests for identifier
     */
    getRemaining(identifier: string): number {
      const entry = this.limits.get(identifier);
      if (!entry || entry.resetAt < Date.now()) {
        return this.maxRequests;
      }
      return Math.max(0, this.maxRequests - entry.count);
    }
  
    /**
     * Reset rate limit for identifier
     */
    reset(identifier: string): void {
      this.limits.delete(identifier);
    }
  
    /**
     * Cleanup expired entries
     */
    private cleanup(): void {
      const now = Date.now();
      for (const [key, entry] of this.limits.entries()) {
        if (entry.resetAt < now) {
          this.limits.delete(key);
        }
      }
    }
  }
  
  // Create rate limiters for different actions
  export const createSessionLimiter = new RateLimiter(5, 60000); // 5 per minute
  export const joinSessionLimiter = new RateLimiter(10, 60000); // 10 per minute
  export const voteLimiter = new RateLimiter(30, 60000); // 30 per minute
  export const storyUpdateLimiter = new RateLimiter(20, 60000); // 20 per minute
  
  export default RateLimiter;