/**
 * Session storage utilities for persisting user session
 */

export interface StoredSession {
    sessionId: string;
    userName: string;
    isHost: boolean;
    lastActive: number;
  }
  
  const STORAGE_KEY = 'planningPoker_session';
  const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
  
  /**
   * Save session to localStorage
   */
  export function saveSession(session: StoredSession): void {
    try {
      const data = {
        ...session,
        lastActive: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }
  
  /**
   * Load session from localStorage
   */
  export function loadSession(): StoredSession | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
  
      const session: StoredSession = JSON.parse(stored);
      
      // Check if session is expired
      const isExpired = Date.now() - session.lastActive > EXPIRY_TIME;
      if (isExpired) {
        clearSession();
        return null;
      }
  
      return session;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }
  
  /**
   * Clear session from localStorage
   */
  export function clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }
  
  /**
   * Update last active timestamp
   */
  export function updateLastActive(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
  
      const session: StoredSession = JSON.parse(stored);
      session.lastActive = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to update last active:', error);
    }
  }
  
  /**
   * Check if there's a valid stored session
   */
  export function hasValidSession(): boolean {
    const session = loadSession();
    return session !== null;
  }