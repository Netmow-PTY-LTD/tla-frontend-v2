/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { createContext, useContext, useState } from 'react';
import { useNotifications, useResponseRoom } from '@/hooks/useSocketListener';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useSearchParams } from 'next/navigation';

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
  const { data: user } = useAuthUserInfoQuery();
  const userId = user?.data?._id;
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const [messages, setMessages] = useState([]);

  // ✅ Hooks must be called at top level
  useNotifications(userId, (data) => {
    console.log('🔔 Notification:', data);
    alert(data.text);
  });

  useResponseRoom(responseId, (data) => {
    console.log('💬 Response room message:', data);
    //setMessages((prev) => [...prev, data]);
  });

  return (
    <SocketContext.Provider value={{ messages, responseId, userId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
