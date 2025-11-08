// Directory: frontend/store/sessionStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

// This is the "brain" of your application.
// It's a Zustand store that holds the session state.

// Define the shape of the state
interface SessionState {
  sessionId: string | null;
  roomCode: string | null;
  role: 'host' | 'guest' | null;
  socket: Socket | null;
  isConnected: boolean;

  // Actions
  setSession: (sessionId: string, roomCode: string) => void;
  setRole: (role: 'host' | 'guest') => void;
  connectSocket: (sessionId: string) => void;
  clearSession: () => void;
}

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';

export const useSessionStore = create<SessionState>((set, get) => ({
  // --- STATE ---
  sessionId: null,
  roomCode: null,
  role: null,
  socket: null,
  isConnected: false,

  // --- ACTIONS ---

  /**
   * Stores the session ID and room code.
   */
  setSession: (sessionId, roomCode) => {
    set({ sessionId, roomCode });
  },

  /**
   * Sets the user's role.
   */
  setRole: (role) => {
    set({ role });
  },

  /**
   * Creates and connects the socket.io client.
   */
  connectSocket: (sessionId) => {
    const { socket, role } = get();

    // Prevent multiple connections
    if (socket) return;

    // Create a new socket connection
    // We pass the sessionId and role in the query for the backend to use
    const newSocket = io(SOCKET_SERVER_URL, {
      query: {
        sessionId: sessionId,
        role: role,
      },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    set({ socket: newSocket });
  },

  /**
   * Clears the entire session, disconnects socket, and resets state.
   */
  clearSession: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      sessionId: null,
      roomCode: null,
      role: null,
      socket: null,
      isConnected: false,
    });
  },
}));