'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { getSocket } from '@/lib/socket';

export default function GlobalSocketListener() {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?._id;
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket(userId);
    socketRef.current = socket;

    // Join global room
    socket.emit('join-room', 'global-room');

    const handleToast = (data) => {
      const senderId = typeof data.from === 'object' ? data.from._id : data.from;
      const senderName = data.from?.profile?.name || senderId || 'Unknown';

      // Only show toast if sender is not current user
      if (senderId !== userId) {
        toast(`${senderName}: ${data.message}`, {
          duration: 5000,
          position: 'top-center',
        });
      }
    };

    socket.on(`toast:${userId}`, handleToast);

    return () => {
      socket.off(`toast:${userId}`, handleToast);
      socket.disconnect();
    };
  }, [userId]);

  return <></>;
}


