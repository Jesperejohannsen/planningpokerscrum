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
  
  export interface ErrorData {
    message: string;
  }
  
  export interface SessionCreatedResponse {
    sessionId: string;
    session: Session;
  }
  
  export interface SessionJoinedResponse {
    session: Session;
  }
  
  export interface SessionUpdateResponse {
    session: Session;
  }
  
  export type CardValue = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '34' | '55' | '?' | '☕';