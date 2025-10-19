export interface ValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  /**
   * Validate username
   */
  export function validateUsername(username: string): ValidationResult {
    if (!username || typeof username !== 'string') {
      return { isValid: false, error: 'Username is required' };
    }
  
    const trimmed = username.trim();
    
    if (trimmed.length < 2) {
      return { isValid: false, error: 'Username must be at least 2 characters' };
    }
    
    if (trimmed.length > 30) {
      return { isValid: false, error: 'Username must be less than 30 characters' };
    }
    
    // Only allow alphanumeric, spaces, hyphens, underscores
    const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validPattern.test(trimmed)) {
      return { isValid: false, error: 'Username contains invalid characters' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validate session name
   */
  export function validateSessionName(sessionName: string): ValidationResult {
    if (!sessionName || typeof sessionName !== 'string') {
      return { isValid: false, error: 'Session name is required' };
    }
  
    const trimmed = sessionName.trim();
    
    if (trimmed.length < 3) {
      return { isValid: false, error: 'Session name must be at least 3 characters' };
    }
    
    if (trimmed.length > 50) {
      return { isValid: false, error: 'Session name must be less than 50 characters' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validate story description
   */
  export function validateStory(story: string): ValidationResult {
    if (typeof story !== 'string') {
      return { isValid: false, error: 'Story must be a string' };
    }
  
    if (story.length > 500) {
      return { isValid: false, error: 'Story must be less than 500 characters' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validate vote value
   */
  export function validateVote(vote: string): ValidationResult {
    const validVotes = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'];
    
    if (!validVotes.includes(vote)) {
      return { isValid: false, error: 'Invalid vote value' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Check if username already exists in session
   */
  export function isUsernameTaken(session: any, username: string, currentSocketId?: string): boolean {
    const trimmed = username.trim().toLowerCase();
    
    return Object.values(session.participants).some((participant: any) => {
      // Skip if it's the current user
      if (currentSocketId && participant.id === currentSocketId) {
        return false;
      }
      
      // Check if name matches and user is connected
      return participant.name.toLowerCase() === trimmed && participant.connected;
    });
  }
  
  /**
   * Sanitize user input to prevent XSS
   */
  export function sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/[^\w\s\-_]/g, ''); // Remove special chars except space, hyphen, underscore
  }