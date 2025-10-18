import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

interface ErrorNotificationProps {
  error: string;
}

export function ErrorNotification({ error }: ErrorNotificationProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!error || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="cyber-card p-4 max-w-md border-2 border-red-500/50 bg-red-500/10 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 flex-1">{error}</p>
          <button
            onClick={() => setDismissed(true)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorNotification;