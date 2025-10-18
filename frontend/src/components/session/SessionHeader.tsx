import { Check, Copy } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 truncate">
            {session.name}
          </h1>
          <p className="text-sm text-gray-600">Session: {sessionId}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <ConnectionStatus connected={connected} />
          
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
      
      {isHost && (
        <div className="mt-4">
          <input
            type="text"
            value={session.currentStory || ''}
            onChange={(e) => onUpdateStory(e.target.value)}
            placeholder="Enter the current story or task to estimate..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}
      
      {!isHost && session.currentStory && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="font-medium text-gray-800">{session.currentStory}</p>
        </div>
      )}
    </div>
  );
}

export default SessionHeader;