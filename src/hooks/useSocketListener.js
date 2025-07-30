
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
