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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Session</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Sprint 24 Planning"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
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
              />
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!sessionName.trim() || !userName.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mt-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create Session
          </button>
          
          <button
            onClick={onBack}
            className="w-full text-gray-600 py-2 mt-2 hover:text-gray-800"
          >
            Back
          </button>
        </div>
      </div>
    );
  }
  
  export default CreateSessionView;