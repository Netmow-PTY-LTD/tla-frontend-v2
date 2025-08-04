
// // lib/socket.js
// import { io } from "socket.io-client";

// let socket = null;

// const url = process.env.NEXT_PUBLIC_BASE_URL;
// export const getSocket = (userId) => {
//   // If userId not ready, don't create socket
//   if (!userId) return null;

//   if (!socket) {
//     console.log("🔌 Connecting socket for user:", userId);
//     socket = io(`${url}`, {
//       query: { userId },
//     });
//   }
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };




// import { io } from "socket.io-client";

// let socket = null;

// const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL;

// export const getSocket = (userId) => {
//   if (!userId || typeof window === "undefined") return null;

//   // Reuse existing socket if it's already connected to the same user
//   if (socket && socket.connected) {
//     const existingUserId = socket?.io?.opts?.query?.userId;
//     if (existingUserId === userId) return socket;
//   }

//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }

//   console.log("🔌 Connecting new socket for user:", userId);

//   socket = io(SOCKET_URL, {
//     query: { userId },
//     transports: ["websocket"], // force WebSocket (faster)
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//     timeout: 5000,
//   });

//   socket.on("connect", () => {
//     console.log(`✅ Socket connected: ${socket.id}`);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log(`❌ Socket disconnected:`, reason);
//   });

//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     console.log("🛑 Disconnecting socket");
//     socket.disconnect();
//     socket = null;
//   }
// };






//  --------------------- part 2 ---------------


import { io, Socket } from "socket.io-client";

let socket = null;

 const url = process.env.NEXT_PUBLIC_BASE_URL;

export const getSocket = (userId) => {
  // If userId not ready, don't create socket
  if (!userId) return null;

  if (!socket) {
    console.log("🔌 Connecting socket for user:", userId);
    socket = io(`${url}`, {
      query: { userId },
    });
  }
  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from socket");
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
