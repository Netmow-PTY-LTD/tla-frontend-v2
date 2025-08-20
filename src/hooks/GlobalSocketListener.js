'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast} from 'sonner';
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

    // Join global-room
    socket.emit('join-room', 'global-room');

    // Listen for global messages
    const handleGlobalMessage = (data) => {
        console.log('check toast data ==>',data)
      const senderId = typeof data.from === 'object' ? data.from._id : data.from;
      const senderName = data.from?.profile?.name || senderId || 'Unknown';

      // Only show toast if the sender is not the current user
      if (senderId !== userId) {
        toast(`${senderName} sent: ${data.message}`, {
          duration: 5000,
          position:'top-center'
         
        });
      }
    };

          console.log('check toast data ==>',`toast:${userId}`)
    socket.on(`toast:${userId}`, handleGlobalMessage);

    return () => {
      socket.off(`toast:${userId}`, handleGlobalMessage);
      socket.disconnect();
    };
  }, [userId]);

//   return <Toaster position="top-center" />;
  return <></>;
}


// 'use client';

// import { useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { toast} from 'sonner';
// import { selectCurrentUser } from '@/store/features/auth/authSlice';
// import { getSocket } from '@/lib/socket';

// export default function GlobalSocketListener() {
//   const currentUser = useSelector(selectCurrentUser);
//   const userId = currentUser?._id;
//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!userId) return;

//     const socket = getSocket(userId);
//     socketRef.current = socket;

//     // Join global-room
//     socket.emit('join-room', 'global-room');

//     // Listen for global messages
//     const handleGlobalMessage = (data) => {
//         console.log('check toast data ==>',data)
//       const senderId = typeof data.from === 'object' ? data.from._id : data.from;
//       const senderName = data.from?.profile?.name || senderId || 'Unknown';

//       // Only show toast if the sender is not the current user
//       if (senderId !== userId) {
//         toast(`${senderName} sent: ${data.message}`, {
//           duration: 5000,
//           position:'top-center'
         
//         });
//       }
//     };

//     socket.on('chat-message', handleGlobalMessage);

//     return () => {
//       socket.off('chat-message', handleGlobalMessage);
//       socket.disconnect();
//     };
//   }, [userId]);

// //   return <Toaster position="top-center" />;
//   return <></>;
// }
