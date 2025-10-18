import { Users } from 'lucide-react';
import { ConnectionStatus } from '../components/layout/ConnectionStatus';
import type { ViewType } from '../types'; // ← Add this import

interface HomeProps {
  connected: boolean;
  onNavigate: (view: ViewType) => void;  // ← Change from string to ViewType
  error: string;
}

export function Home({ connected, onNavigate, error }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Planning Poker</h1>
          <p className="text-gray-600">Real-time estimation for your team</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <ConnectionStatus connected={connected} />
        </div>
        
        <button
          onClick={() => onNavigate('create')}
          disabled={!connected}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Planning Poker Session
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Real-time sync • Secure sessions • No registration needed
        </p>
      </div>
    </div>
  );
}

export default Home;