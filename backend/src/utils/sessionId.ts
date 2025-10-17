const ADJECTIVES: readonly string[] = [
    'happy', 'clever', 'bright', 'swift', 'brave', 
    'calm', 'wise', 'kind', 'bold', 'cool',
    'epic', 'keen', 'witty', 'zesty', 'vivid'
  ] as const;
  
  const ANIMALS: readonly string[] = [
    'cat', 'dog', 'fox', 'owl', 'bear', 
    'wolf', 'hawk', 'lion', 'panda', 'eagle',
    'tiger', 'dragon', 'phoenix', 'lynx', 'falcon'
  ] as const;
  
  export function generateSessionId(): string {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const number = Math.floor(Math.random() * 1000);
    
    return `${adjective}-${animal}-${number}`;
  }
  
  export function isValidSessionId(sessionId: string): boolean {
    if (!sessionId || typeof sessionId !== 'string') return false;
    
    const parts = sessionId.split('-');
    if (parts.length !== 3) return false;
    
    const [adj, animal, num] = parts;
    return ADJECTIVES.includes(adj) && 
           ANIMALS.includes(animal) && 
           !isNaN(parseInt(num, 10));
  }
  
  export default { generateSessionId, isValidSessionId };