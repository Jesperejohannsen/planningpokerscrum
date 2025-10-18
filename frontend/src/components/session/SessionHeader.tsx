import { Check, Copy, Hash } from 'lucide-react';
import { useState } from 'react';
import type { Session } from '../../types';
import { copyToClipboard, generateSessionLink } from '../../utils/clipboard';
import { ConnectionStatus } from '../layout/ConnectionStatus';

interface SessionHeaderProps {
  session: Session;
  sessionId: string;
  isHost: boolean;
  connected: boolean;
  onUpdateStory: (story: string) => void;
}

export function SessionHeader({
  session,
  sessionId,
  isHost,
  connected,
  onUpdateStory
}: SessionHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const link = generateSessionLink(sessionId);
    const success = await copyToClipboard(link);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="cyber-card rounded-2xl shadow-2xl p-6 mb-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent truncate">
            {session.name}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <Hash className="w-4 h-4" />
            <span className="font-mono">{sessionId}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ConnectionStatus connected={connected} />
          
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-neon-blue border-2 border-neon-blue/30 hover:bg-neon-blue/10 transition-all font-medium neon-button"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
      
      {isHost && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
            Current Story
          </label>
          <input
            type="text"
            value={session.currentStory || ''}
            onChange={(e) => onUpdateStory(e.target.value)}
            placeholder="Enter the current story or task to estimate..."
            className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/20 transition-all bg-dark-800/50 text-white placeholder-gray-500"
          />
        </div>
      )}
      
      {!isHost && session.currentStory && (
        <div className="mt-4 p-4 glass rounded-xl border-l-4 border-neon-blue">
          <p className="text-sm text-gray-400 mb-1">Current Story</p>
          <p className="font-medium text-white">{session.currentStory}</p>
        </div>
      )}
    </div>
  );
}

export default SessionHeader;