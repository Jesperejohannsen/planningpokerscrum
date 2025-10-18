/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
  
  /**
   * Generate session link
   */
  export function generateSessionLink(sessionId: string): string {
    const { origin, pathname } = window.location;
    return `${origin}${pathname}?session=${sessionId}`;
  }
  
  export default { copyToClipboard, generateSessionLink };