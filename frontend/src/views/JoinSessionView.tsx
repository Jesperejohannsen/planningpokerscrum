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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Join Session</h2>
          
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-indigo-900">
              Session ID: <span className="font-mono font-bold">{sessionId}</span>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!userName.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mt-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Join Session
          </button>
        </div>
      </div>
    );
  }
  
  export default JoinSessionView;