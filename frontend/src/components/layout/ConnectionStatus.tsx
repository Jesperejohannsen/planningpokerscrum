import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  connected: boolean;
}

/**
 * Connection status indicator
 */
export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {connected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-600">Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-red-600">Reconnecting...</span>
        </>
      )}
    </div>
  );
}

export default ConnectionStatus;