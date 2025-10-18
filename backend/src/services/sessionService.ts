import { redis, SESSION_TTL } from '../config/redis.js';
import type { Participant, Session } from '../types/index.js';
import { logger } from '../utils/logger.js';

class SessionService {
  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

  async createSession(sessionId: string, sessionData: Session): Promise<Session> {
    try {
      const key = this.getSessionKey(sessionId);
      await redis.setex(key, SESSION_TTL, JSON.stringify(sessionData));
      logger.info(`Session created: ${sessionId}`);
      return sessionData;
    } catch (error) {
      logger.error('Error creating session:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<Session | null> {
    try {
      const key = this.getSessionKey(sessionId);
      const data = await redis.get(key);
      
      if (!data) {
        return null;
      }
      
      return JSON.parse(data) as Session;
    } catch (error) {
      logger.error('Error getting session:', error);
      throw error;
    }
  }

  async updateSession(sessionId: string, sessionData: Session): Promise<Session> {
    try {
      const key = this.getSessionKey(sessionId);
      await redis.setex(key, SESSION_TTL, JSON.stringify(sessionData));
      return sessionData;
    } catch (error) {
      logger.error('Error updating session:', error);
      throw error;
    }
  }

  async addParticipant(sessionId: string, participant: Participant): Promise<Session> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.participants[participant.id] = participant;
      await this.updateSession(sessionId, session);
      
      logger.info(`Participant ${participant.name} joined session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error('Error adding participant:', error);
      throw error;
    }
  }

  async updateParticipant(
    sessionId: string, 
    participantId: string, 
    updates: Partial<Participant>
  ): Promise<Session> {
    try {
      const session = await this.getSession(sessionId);
      if (!session || !session.participants[participantId]) {
        throw new Error('Session or participant not found');
      }

      session.participants[participantId] = {
        ...session.participants[participantId],
        ...updates
      };

      await this.updateSession(sessionId, session);
      return session;
    } catch (error) {
      logger.error('Error updating participant:', error);
      throw error;
    }
  }

  async castVote(sessionId: string, participantId: string, vote: string): Promise<Session> {
    return this.updateParticipant(sessionId, participantId, { vote });
  }

  async revealVotes(sessionId: string): Promise<Session> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.votesRevealed = true;
      await this.updateSession(sessionId, session);
      
      logger.info(`Votes revealed in session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error('Error revealing votes:', error);
      throw error;
    }
  }

  async hideVotes(sessionId: string): Promise<Session> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.votesRevealed = false;
      await this.updateSession(sessionId, session);
      
      logger.info(`Votes hidden in session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error('Error hiding votes:', error);
      throw error;
    }
  }

  async resetVotes(sessionId: string): Promise<Session> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
  
      // ← ADD DEBUG LOG
      console.log('🔄 BEFORE saving - Story:', session.currentStory);
      console.log('🔄 BEFORE saving - Revealed:', session.votesRevealed);
  
      // Save current story BEFORE resetting (if conditions are met)
      if (session.votesRevealed) {
        console.log('💾 Saving story to history...');
        // Proceed with saving logic
      
        // Collect votes
        const votes: Record<string, { name: string; vote: string }> = {};
        const numericVotes: number[] = [];
  
        Object.values(session.participants).forEach(participant => {
          if (participant.vote !== null) {
            votes[participant.id] = {
              name: participant.name,
              vote: participant.vote
            };
  
            const numVote = parseFloat(participant.vote);
            if (!isNaN(numVote)) {
              numericVotes.push(numVote);
            }
          }
        });
  
        // Calculate average
        let averageVote = '—';
        if (numericVotes.length > 0) {
          const avg = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
          averageVote = avg.toFixed(1);
        }
  
        // Check consensus
        const uniqueVotes = new Set(Object.values(votes).map(v => v.vote));
        const consensus = uniqueVotes.size === 1;
  
        // Create story result
        const storyResult = {
          story: session.currentStory,
          votes,
          timestamp: Date.now(),
          averageVote,
          consensus
        };
  
        // Initialize history if needed
        if (!session.storyHistory) {
          session.storyHistory = [];
        }
  
        // Add to history
        session.storyHistory.push(storyResult);
        
        console.log('✅ Story saved! History length:', session.storyHistory.length);
        console.log('📜 Latest story:', storyResult.story);
      } else {
        console.log('❌ Not saving - Story empty or votes not revealed');
      }
  
      // NOW reset everything
      Object.values(session.participants).forEach(participant => {
        participant.vote = null;
      });
  
      session.votesRevealed = false;
      session.currentStory = '';
  
      await this.updateSession(sessionId, session);
      
      logger.info(`Votes reset in session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error('Error resetting votes:', error);
      throw error;
    }
  }

  async updateStory(sessionId: string, story: string): Promise<Session> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.currentStory = story;
      await this.updateSession(sessionId, session);
      console.log('✅ Saved story result. History now has', session.storyHistory.length, 'items');
      logger.info(`Story result saved for session ${sessionId}`);
      return session;
            
    } catch (error) {
      logger.error('Error updating story:', error);
      throw error;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      await redis.del(key);
      logger.info(`Session deleted: ${sessionId}`);
    } catch (error) {
      logger.error('Error deleting session:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;