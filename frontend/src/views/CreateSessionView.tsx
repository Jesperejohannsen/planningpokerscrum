import { ArrowLeft, Sparkles } from 'lucide-react';

interface CreateSessionViewProps {
  sessionName: string;
  setSessionName: (name: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function CreateSessionView({
  sessionName,
  setSessionName,
  userName,
  setUserName,
  onSubmit,
  onBack
}: CreateSessionViewProps) {
  const handleSubmit = () => {
    if (sessionName.trim() && userName.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 bg-cyber-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple opacity-10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink opacity-10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="cyber-card rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
            Create Session
          </h2>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
              Session Name
            </label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Sprint 24 Planning"
              className="w-full px-4 py-4 glass rounded-xl border-2 border-white/10 focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/20 transition-all bg-dark-800/50 text-white placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-4 glass rounded-xl border-2 border-white/10 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 transition-all bg-dark-800/50 text-white placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!sessionName.trim() || !userName.trim()}
          className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 mt-6 disabled:opacity-30 disabled:cursor-not-allowed neon-button shadow-lg hover:shadow-neon-purple/50"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Session
          </span>
        </button>
        
        <button
          onClick={onBack}
          className="w-full glass text-gray-300 hover:text-white py-3 rounded-xl mt-3 hover:border-neon-purple/50 border-2 border-white/10 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
}

export default CreateSessionView;