
'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';

export const useNotifications = (userId, onNotify) => {
  useEffect(() => {
    if (!userId) return; // don't connect yet
    const socket = getSocket(userId);
    if (!socket) return;

    socket.on('notification', onNotify);
    return () => socket.off('notification', onNotify);
  }, [userId, onNotify]);
};

export const useResponseRoom = (responseId, onUpdate, userId) => {
  useEffect(() => {
    if (!userId || !responseId) return;
    const socket = getSocket(userId);
    if (!socket) return;

    socket.emit('join-response', responseId);
    socket.on('response-update', onUpdate);
    return () => socket.off('response-update', onUpdate);
  }, [responseId, userId, onUpdate]);
};

export const useResponseRoomUser = (userId, onUpdate) => {
  useEffect(() => {
    if (!userId) return;
    const socket = getSocket(userId);
    if (!socket) return;

    socket.emit('user-notification', userId); // 🔌 Join user room
    socket.emit(`user:${userId}`, userId); // 🔌 Join user room
    socket.on('notif', onUpdate);

    return () => socket.off('notif', onUpdate);
  }, [userId, onUpdate]);
};


//  ------------------ user status event listener ------------

// export const useUserStatus = (userId, onStatusChange) => {
//   useEffect(() => {
//     const socket = getSocket(userId);

//     socket.on("userOnline", ({ userId }) =>
//       onStatusChange(userId, "online"),
//       console.log('test online ')
//     );
//     socket.on("userOffline", ({ userId }) =>
//       onStatusChange(userId, "offline"),
//     console.log('test offline ')
//     );

//     return () => {
//       socket.off("userOnline");
//       socket.off("userOffline");
//     };
//   }, [userId, onStatusChange]);
// };








//  ----------------------------- new logic -------------------

export const useRealTimeStatus = (currentUserId,userIds, updateStatus ) => {
  useEffect(() => {
 
   if (!userIds || userIds.length === 0) return;
    // const socket = getSocket(userIds);
    const socket = getSocket(currentUserId);

     if (!socket) {
      console.warn("❌ Socket not initialized.");
      return;
    }
    const handleOnline = ({ userId }) => {
      if (userIds.includes(userId)) {
        updateStatus(userId, true);
      }
    };

    const handleOffline = ({ userId }) => {
      if (userIds.includes(userId)) {
        updateStatus(userId, false);
      }
    };

    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [userIds]);
};