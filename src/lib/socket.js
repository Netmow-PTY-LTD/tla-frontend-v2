

import { io } from 'socket.io-client';

let socket = null; // singleton instance

const url = process.env.NEXT_PUBLIC_BASE_URL;

export const getSocket = (userId) => {

  console.log('socket userId',userId)
  // Don't initialize if userId is missing
  if (!userId) {
    console.warn("⚠️ No userId provided for socket connection.");
    return null;
  }

  // Return existing socket if already connected
  if (socket?.connected) return socket;

  // Initialize socket connection
  console.log("🔌 Connecting socket for user:", userId);
  socket = io(url, {
    query: { userId },
    transports: ['websocket'], // better reliability
    forceNew: true,            // ensure fresh connection
    reconnection: true,        // allow reconnections
    reconnectionAttempts: 5,   // limit retry attempts
    timeout: 10000   ,          // 10 seconds timeout
  });

  socket.on('connect', () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on('connect_error', (err) => {
    console.error("🚫 Socket connection error:", err.message);
  });

  return socket;
};


export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket:", socket.id);
    socket.disconnect();
    socket = null;
     
  }
};
