import { CheckCircle, ChevronDown, ChevronUp, Clock, TrendingUp, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { StoryResult } from '../../types';

interface StoryHistoryProps {
  history: StoryResult[];
}

export function StoryHistory({ history }: StoryHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  if (!history || history.length === 0) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="cyber-card rounded-2xl p-6 animate-slide-up">
    <button
      onClick={() => {
        console.log('Button clicked');
        setExpanded(!expanded);
      }}
      className="w-full flex items-center justify-between text-left group cursor-pointer hover:opacity-90 transition-opacity"
      style={{ pointerEvents: 'auto' }}
    >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-neon-yellow to-neon-green rounded-lg">
            <Clock className="w-5 h-5 text-dark-900" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Story History</h3>
            <p className="text-sm text-gray-400">{history.length} stories completed</p>
          </div>
        </div>
        
        {expanded ? (
          <ChevronUp className="w-6 h-6 text-neon-yellow group-hover:text-neon-green transition-colors" />
        ) : (
          <ChevronDown className="w-6 h-6 text-neon-yellow group-hover:text-neon-green transition-colors" />
        )}
      </button>

      {expanded && (
        <div className="mt-6 space-y-3">
          {[...history].reverse().map((story, index) => {
            const actualIndex = history.length - 1 - index;
            const isSelected = selectedStory === actualIndex;

            return (
              <div
                key={actualIndex}
                className="glass rounded-xl overflow-hidden border-2 border-white/10 hover:border-neon-yellow/30 transition-all"
              >
                <button
                  onClick={() => setSelectedStory(isSelected ? null : actualIndex)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">
                        #{history.length - index}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(story.timestamp)}
                      </span>
                      {story.consensus && (
                        <div className="flex items-center gap-1 text-xs bg-neon-green/20 text-neon-green px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Consensus
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium truncate">{story.story}</p>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-neon-blue/30">
                      <TrendingUp className="w-4 h-4 text-neon-blue" />
                      <span className="text-sm font-bold text-neon-blue">
                        {story.averageVote}
                      </span>
                    </div>
                    
                    {isSelected ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isSelected && (
                  <div className="px-4 pb-4 border-t border-white/10">
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {Object.entries(story.votes).map(([id, voteData]) => (
                        <div
                          key={id}
                          className="glass rounded-lg p-3 border border-white/5"
                        >
                          <p className="text-xs text-gray-400 mb-1 truncate">
                            {voteData.name}
                          </p>
                          <p className="text-2xl font-bold text-neon-blue">
                            {voteData.vote}
                          </p>
                        </div>
                      ))}
                    </div>

                    {!story.consensus && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400/80">
                        <XCircle className="w-3 h-3" />
                        No consensus reached
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StoryHistory;