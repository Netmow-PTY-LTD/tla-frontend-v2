/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { createContext, useContext, useState } from 'react';
import { useNotifications, useResponseRoom } from '@/hooks/useSocketListener';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/auth/authSlice';

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
  const userId=useSelector(selectCurrentUser)?._id
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const [messages, setMessages] = useState([]);

  // ✅ Hooks must be called at top level
  useNotifications(userId, (data) => {

    // alert(data.text);
  });

  useResponseRoom(responseId, (data) => {

    //setMessages((prev) => [...prev, data]);
  });

  return (
    <SocketContext.Provider value={{ messages, responseId, userId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
