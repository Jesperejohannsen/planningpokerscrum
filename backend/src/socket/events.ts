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
  
  export const SERVER_EVENTS = {
    SESSION_CREATED: 'sessionCreated',
    SESSION_JOINED: 'sessionJoined',
    PARTICIPANT_UPDATE: 'participantUpdate',
    VOTE_UPDATE: 'voteUpdate',
    VOTES_REVEALED: 'votesRevealed',
    VOTES_HIDDEN: 'votesHidden',
    VOTES_RESET: 'votesReset',
    STORY_UPDATE: 'storyUpdate',
    ERROR: 'error',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect'
  } as const;
  
  export type ClientEvent = typeof CLIENT_EVENTS[keyof typeof CLIENT_EVENTS];
  export type ServerEvent = typeof SERVER_EVENTS[keyof typeof SERVER_EVENTS];
  
  export default { CLIENT_EVENTS, SERVER_EVENTS };