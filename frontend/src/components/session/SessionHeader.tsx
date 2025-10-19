import { Check, Copy, LogOut, Pencil, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import type { Session } from '../../types';
import { copyToClipboard } from '../../utils/clipboard';

interface SessionHeaderProps {
  session: Session;
  sessionId: string;
  isHost: boolean;
  connected: boolean;
  onUpdateStory: (story: string) => void;
  onLeaveSession?: () => void;
}

export function SessionHeader({ 
  session, 
  sessionId, 
  isHost, 
  connected,
  onUpdateStory,
  onLeaveSession
}: SessionHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [storyInput, setStoryInput] = useState(session?.currentStory || '');

  const handleCopy = async () => {
    const sessionUrl = `${window.location.origin}?join=${sessionId}`;
    const success = await copyToClipboard(sessionUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveStory = () => {
    onUpdateStory(storyInput);
    setIsEditingStory(false);
  };

  const handleCancelEdit = () => {
    setStoryInput(session?.currentStory || '');
    setIsEditingStory(false);
  };

  return (
    <div className="cyber-card rounded-2xl p-6 mb-6 animate-slide-down">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {session?.name || 'Planning Poker'}
              </h1>
              <p className="text-sm text-gray-400">
                Session ID: <span className="font-mono text-neon-blue">{sessionId}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              connected 
                ? 'glass border border-green-500/30' 
                : 'glass border border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className={connected ? 'text-green-400' : 'text-red-400'}>
                {connected ? 'Connected' : 'Reconnecting...'}
              </span>
            </div>

            {isHost && (
              <div className="glass border border-neon-yellow/30 px-3 py-1.5 rounded-lg">
                <span className="text-neon-yellow text-sm font-bold">👑 Host</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="neon-button glass border-2 border-neon-blue/50 text-neon-blue px-4 py-2 rounded-xl font-bold hover:bg-neon-blue/10 transition-all flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span className="hidden sm:inline">Copy Link</span>
              </>
            )}
          </button>

          {onLeaveSession && (
            <button
              onClick={onLeaveSession}
              className="neon-button glass border-2 border-red-500/50 text-red-400 px-4 py-2 rounded-xl font-bold hover:bg-red-500/10 transition-all flex items-center gap-2"
              title="Leave Session"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          )}
        </div>
      </div>

      {/* Current Story Section */}
      <div className="glass rounded-xl p-4 border-2 border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
            Current Story
          </h3>
          {isHost && !isEditingStory && (
            <button
              onClick={() => setIsEditingStory(true)}
              className="text-neon-blue hover:text-neon-purple transition-colors p-1"
              title="Edit Story"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingStory ? (
          <div className="space-y-3">
            <input
              type="text"
              value={storyInput}
              onChange={(e) => setStoryInput(e.target.value)}
              placeholder="Enter story description..."
              className="w-full px-4 py-3 bg-dark-800/50 border-2 border-neon-blue/30 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
              autoFocus
              maxLength={200}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveStory}
                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 glass border-2 border-white/10 text-gray-400 rounded-lg font-bold hover:border-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white text-lg">
            {session?.currentStory || (
              <span className="text-gray-500 italic">
                {isHost ? 'Click the edit button to add a story' : 'No story yet'}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default SessionHeader;