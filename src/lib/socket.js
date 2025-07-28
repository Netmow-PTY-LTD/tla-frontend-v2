
// import { io } from "socket.io-client";

// let socket;

// export const initSocket = () => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
//       transports: ['websocket'],
//       withCredentials: true, // if needed for auth
//     });
//   }
//   return socket;
// };

// export const getSocket = () => {
//   if (!socket) {
//     console.warn("Socket not initialized. Call initSocket() first.");
//   }
//   return socket;
// };




// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export const getSocket = (userId) => {
  // If userId not ready, don't create socket
  if (!userId) return null;

  if (!socket) {
    console.log("🔌 Connecting socket for user:", userId);
    socket = io("http://localhost:5000", {
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