"use client"
import { getSocket } from "@/lib/socket";
import { useEffect } from "react";


export const useSocketListener = (event, callback) => {
  useEffect(() => {
    const socket = getSocket();
    socket.on(event, callback);

    return () => socket.off(event, callback);
  }, [event, callback]);
};
