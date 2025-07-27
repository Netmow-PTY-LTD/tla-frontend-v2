
"use client";

import { useEffect } from "react";
import { initSocket } from "@/lib/socket";

export default function SocketProvider() {
  useEffect(() => {
    const socket = initSocket();
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    socket.on("notification", (data) => {
      console.log("Notification received:", data);
      // You can show a toast or update UI here
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, []);

  return null;
}
