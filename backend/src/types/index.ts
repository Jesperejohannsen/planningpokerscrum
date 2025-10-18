/**
 * Backend TypeScript Types
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
    storyHistory: StoryResult[]; 
  }
  export interface StoryResult {
    story: string;
    votes: Record<string, { name: string; vote: string }>;
    timestamp: number;
    averageVote: string;
    consensus: boolean;
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