
import { io } from 'socket.io-client';

let socket = null; // singleton instance
let currentUserId = null; // ✅ track which user owns the socket

const url = process.env.NEXT_PUBLIC_BASE_URL;

export const getSocket = (userId) => {

  console.log('socket userId', userId);
  // Don't initialize if userId is missing
  if (!userId) {
    console.warn("⚠️ No userId provided for socket connection.");
    return null;
  }

  // ✅ Reuse existing socket if connected for the same user
  if (socket?.connected && currentUserId === userId) {
    return socket;
  }

  // ✅ If switching users, disconnect old socket first
  if (socket && currentUserId !== userId) {
    console.log("🔄 User changed, disconnecting old socket");
    socket.disconnect();
    socket = null;
  }

  // Initialize socket connection
  // ✅ FIXED: Removed forceNew:true — it was destroying all existing connections across tabs
  console.log("🔌 Connecting socket for user:", userId);
  currentUserId = userId;
  socket = io(url, {
    query: { userId },
    transports: ['websocket'], // better reliability
    reconnection: true,        // allow reconnections
    reconnectionAttempts: 5,   // limit retry attempts
    timeout: 10000,            // 10 seconds timeout
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
    currentUserId = null;
  }
};
