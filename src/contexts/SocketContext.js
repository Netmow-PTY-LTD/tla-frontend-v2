/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { useNotifications, useResponseRoom } from '@/hooks/useSocketListener';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
  const { data: user } = useAuthUserInfoQuery();
  const userId = user?.data?._id;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Listen for notifications
    useNotifications(userId, (data) => {
      console.log('🔔 Notification:', data);
      alert(data.text); // Replace with toast if needed
    });

    // Listen to a global response room (optional)
    useResponseRoom('global-room', (data) => {
      console.log('💬 New response room message:', data);
      setMessages((prev) => [...prev, data]);
    });
  }, [userId]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
