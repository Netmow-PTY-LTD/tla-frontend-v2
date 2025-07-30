
// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

const url = process.env.NEXT_PUBLIC_SOCKET_URL;
export const getSocket = (userId) => {
  // If userId not ready, don't create socket
  if (!userId) return null;

  if (!socket) {
    console.log("🔌 Connecting socket for user:", userId);
    socket = io(`${url}`, {
      query: { userId },
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};