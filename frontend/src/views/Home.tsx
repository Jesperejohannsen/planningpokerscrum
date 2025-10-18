import { Sparkles, Users } from 'lucide-react';
import { ConnectionStatus } from '../components/layout/ConnectionStatus';
import type { ViewType } from '../types';

interface HomeProps {
  connected: boolean;
  onNavigate: (view: ViewType) => void;
  error: string;
}

export function Home({ connected, onNavigate, error }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 bg-cyber-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue opacity-10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple opacity-10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="cyber-card rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl mb-4 animate-float">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-2 text-glow">
            Planning Poker
          </h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-yellow" />
            Real-time estimation for your team
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
          <ConnectionStatus connected={connected} />
        </div>
        
        <button
          onClick={() => onNavigate('create')}
          disabled={!connected}
          className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-button shadow-lg hover:shadow-neon-blue/50"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Session
          </span>
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm backdrop-blur">
            {error}
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            Real-time sync
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
            Secure
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
            No signup
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;