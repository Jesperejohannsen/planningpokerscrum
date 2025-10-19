/**
 * Socket.IO Event Constants
 */

// Client -> Server events
export const CLIENT_EVENTS = {
  CREATE_SESSION: 'createSession',
  JOIN_SESSION: 'joinSession',
  CAST_VOTE: 'castVote',
  REVEAL_VOTES: 'revealVotes',
  HIDE_VOTES: 'hideVotes',
  RESET_VOTES: 'resetVotes',
  UPDATE_STORY: 'updateStory',
  DISCONNECT: 'disconnect'
} as const;

// Server -> Client events
export const SERVER_EVENTS = {
  SESSION_CREATED: 'sessionCreated',
  SESSION_JOINED: 'sessionJoined',
  PARTICIPANT_UPDATE: 'participantUpdate',
  SESSION_UPDATE: 'sessionUpdate',        // ADD THIS
  VOTE_UPDATE: 'voteUpdate',
  VOTES_REVEALED: 'votesRevealed',
  VOTES_HIDDEN: 'votesHidden',
  VOTES_RESET: 'votesReset',
  STORY_UPDATE: 'storyUpdate',
  USER_DISCONNECTED: 'userDisconnected',  // ADD THIS
  ERROR: 'error',
  DISCONNECT: 'disconnect'
} as const;

export type ClientEvent = typeof CLIENT_EVENTS[keyof typeof CLIENT_EVENTS];
export type ServerEvent = typeof SERVER_EVENTS[keyof typeof SERVER_EVENTS];