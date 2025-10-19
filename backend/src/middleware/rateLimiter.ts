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
      
      setInterval(() => this.cleanup(), 60000);
    }
  
    isAllowed(identifier: string): boolean {
      const now = Date.now();
      const entry = this.limits.get(identifier);
  
      if (!entry || entry.resetAt < now) {
        this.limits.set(identifier, {
          count: 1,
          resetAt: now + this.windowMs
        });
        return true;
      }
  
      if (entry.count >= this.maxRequests) {
        return false;
      }
  
      entry.count++;
      return true;
    }
  
    getRemaining(identifier: string): number {
      const entry = this.limits.get(identifier);
      if (!entry || entry.resetAt < Date.now()) {
        return this.maxRequests;
      }
      return Math.max(0, this.maxRequests - entry.count);
    }
  
    reset(identifier: string): void {
      this.limits.delete(identifier);
    }
  
    private cleanup(): void {
      const now = Date.now();
      for (const [key, entry] of this.limits.entries()) {
        if (entry.resetAt < now) {
          this.limits.delete(key);
        }
      }
    }
  }
  
  export const createSessionLimiter = new RateLimiter(5, 60000); // 5 per minute
  export const joinSessionLimiter = new RateLimiter(10, 60000); // 10 per minute
  export const voteLimiter = new RateLimiter(30, 60000); // 30 per minute
  export const storyUpdateLimiter = new RateLimiter(20, 60000); // 20 per minute
  
  export default RateLimiter;