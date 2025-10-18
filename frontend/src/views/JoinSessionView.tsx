import { Sparkles, Users } from 'lucide-react';

interface JoinSessionViewProps {
  sessionId: string;
  userName: string;
  setUserName: (name: string) => void;
  onSubmit: () => void;
}

export function JoinSessionView({
  sessionId,
  userName,
  setUserName,
  onSubmit
}: JoinSessionViewProps) {
  const handleSubmit = () => {
    if (userName.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 bg-cyber-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neon-green opacity-10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-neon-blue opacity-10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="cyber-card rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-neon-green to-neon-blue rounded-xl animate-float">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
            Join Session
          </h2>
        </div>
        
        <div className="glass p-5 rounded-2xl mb-6 border-2 border-neon-blue/30 animate-glow">
          <p className="text-sm text-gray-400 mb-2">Session ID</p>
          <p className="font-mono font-bold text-2xl text-neon-blue text-center tracking-wider">
            {sessionId}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-4 glass rounded-xl border-2 border-white/10 focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20 transition-all bg-dark-800/50 text-white placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!userName.trim()}
          className="w-full bg-gradient-to-r from-neon-green to-neon-blue text-dark-900 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 mt-6 disabled:opacity-30 disabled:cursor-not-allowed neon-button shadow-lg hover:shadow-neon-green/50"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Join Session
          </span>
        </button>
      </div>
    </div>
  );
}

export default JoinSessionView;