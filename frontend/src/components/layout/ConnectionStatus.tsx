import { Wifi, WifiOff, Zap } from 'lucide-react';

interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
      ${connected 
        ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' 
        : 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse'
      }
    `}>
      {connected ? (
        <>
          <Wifi className="w-4 h-4" />
          <Zap className="w-3 h-3 animate-pulse" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Reconnecting...</span>
        </>
      )}
    </div>
  );
}

export default ConnectionStatus;