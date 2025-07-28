'use client';

import { useNotifications, useResponseRoom } from '@/hooks/useSocketListener';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  console.log('connected', connected);

  return (
    <div>
      <h1>Socket Test</h1>
      <p>Connected: {connected.toString()}</p>
      <p>Notifications: {JSON.stringify(notifications)}</p>
    </div>
  );
}
// export default function Dashboard() {
//     const {data:user}=useAuthUserInfoQuery()
//     console.log('user data ==>',user)
//   const userId = user?.data?._id;
//   console.log('user Id',userId)
//   const responseId = "xyz789"; // from lead/message context
//   const [messages, setMessages] = useState([]);

//   useNotifications(userId, (data) => {
//     console.log("🔔 New notification:", data);
//     alert(data.text);
//   });

//   useResponseRoom(responseId, (data) => {
//     console.log("💬 Update in response room:", data);
//     setMessages((prev) => [...prev, data]);
//   });

//   return <div>Listening for notifications and chat updates...</div>;
// }

// 'use client';
// import { useNotifications, useResponseRoom } from "@/hooks/useSocketListener";
// import { useAuthUserInfoQuery } from "@/store/features/auth/authApiService";
// import { useState } from "react";

// export default function Dashboard() {
//   const { data: user, isLoading } = useAuthUserInfoQuery();
//   const userId = user?.data?._id;
//   const responseId = "xyz789";
//   const [messages, setMessages] = useState([]);

//   useNotifications(userId, (data) => {
//     console.log("🔔 New notification:", data);
//     alert(data.text);
//   });

//   useResponseRoom(responseId, (data) => {
//     console.log("💬 Update in response room:", data);
//     setMessages((prev) => [...prev, data]);
//   }, userId);

//   if (isLoading) return <div>Loading user...</div>;

//   return <div>Listening for notifications and chat updates...</div>;
// }
