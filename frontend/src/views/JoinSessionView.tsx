import { ArrowLeft, LogIn, Users } from 'lucide-react';

interface JoinSessionViewProps {
  sessionId: string;
  userName: string;
  setUserName: (name: string) => void;
  onSubmit: () => void;
  onBack?: () => void; 
}

export function JoinSessionView({
  sessionId,
  userName,
  setUserName,
  onSubmit,
  onBack
}: JoinSessionViewProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 bg-cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        )}

        <div className="cyber-card rounded-2xl p-8 animate-slide-up">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-neon-purple to-neon-pink rounded-2xl">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
            Join Session
          </h1>
          
          <p className="text-gray-400 text-center mb-8">
            Session ID: <span className="font-mono text-neon-purple">{sessionId}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-dark-800/50 border-2 border-neon-purple/30 rounded-xl text-white placeholder-gray-500 focus:border-neon-purple focus:outline-none transition-colors"
                required
                maxLength={30}
              />
            </div>

            <button
              type="submit"
              className="neon-button w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white px-6 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Join Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinSessionView;