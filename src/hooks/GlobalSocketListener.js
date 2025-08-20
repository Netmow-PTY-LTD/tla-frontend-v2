'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { getSocket } from '@/lib/socket';
import { userDummyImage } from '@/data/data';
import Image from 'next/image';
import ToastMessageGloabal from '@/components/dashboard/common/ToastMessageGloabal';

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
      const senderAvatar = data.from?.profile?.profilePicture || userDummyImage;

      // // Only show toast if sender is not current user
      // if (senderId !== userId) {
      //   toast(`${senderName}: ${data.message}`, {
      //     duration: 5000,
      //     position: 'top-center',
      //   });
      // }

      if (senderId !== userId) {
        toast(
          <ToastMessageGloabal
            senderName={senderName}
            senderAvatar={senderAvatar}
            message={data.message}
          />,
          {
            duration: 5000,
            position: 'top-center',
            style: {
              backgroundColor: '#f3f4f6',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              maxWidth: '360px',
            },
          }
        );
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


