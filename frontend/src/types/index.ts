/**
 * Frontend TypeScript Types
 */

export interface Participant {
    id: string;
    name: string;
    vote: string | null;
    isHost: boolean;
    connected: boolean;
  }
  
  export interface Session {
    id: string;
    name: string;
    hostId: string;
    currentStory: string;
    votesRevealed: boolean;
    participants: Record<string, Participant>;
    createdAt: number;
  }
  
  export interface VoteStatistics {
    average: string;
    median: number;
    min: number;
    max: number;
    count: number;
  }
  
  export type CardValue = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '34' | '55' | '?' | '☕';
  
  export type ViewType = 'home' | 'create' | 'join' | 'session';
  
  export interface CreateSessionData {
    sessionName: string;
    userName: string;
  }
  
  export interface JoinSessionData {
    sessionId: string;
    userName: string;
  }
  
  export interface CastVoteData {
    sessionId: string;
    vote: string;
  }
  
  export interface SessionActionData {
    sessionId: string;
  }
  
  export interface UpdateStoryData {
    sessionId: string;
    story: string;
  }