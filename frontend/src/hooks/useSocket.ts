import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SERVER_EVENTS } from '../constants/events';

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  error: string;
  setError: (error: string) => void;
}

/**
 * Custom hook for Socket.IO connection
 */
export function useSocket(): UseSocketReturn {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000
    });

    const socket = socketRef.current;

    socket.on(SERVER_EVENTS.CONNECT, () => {
      setConnected(true);
      setError('');
      console.log('✅ Connected to server:', socket.id);
    });

    socket.on(SERVER_EVENTS.DISCONNECT, (reason: string) => {
      setConnected(false);
      console.log('❌ Disconnected:', reason);
    });

    socket.on(SERVER_EVENTS.CONNECT_ERROR, (err: Error) => {
      console.error('Connection error:', err.message);
      setError('Failed to connect to server');
      setTimeout(() => setError(''), 5000);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    connected,
    error,
    setError
  };
}

export default useSocket;