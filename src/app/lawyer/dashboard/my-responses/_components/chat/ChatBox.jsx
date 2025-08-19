'use client';

import { getSocket } from '@/lib/socket';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetChatHistoryQuery } from '@/store/features/lawyer/ResponseApiService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Loader, Send, SendHorizontal } from 'lucide-react';
import Image from 'next/image';
import { userDummyImage } from '@/data/data';

dayjs.extend(relativeTime);
dayjs.locale('en-short', {
  ...dayjs.Ls.en,
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '1s', // seconds default to "1m ago"
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});

export default function ChatBox({ response }) {
  const responseId = response?._id;
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?._id;

  const [message, setMessage] = useState('');
  const [liveMessages, setLiveMessages] = useState([]);

  const socketRef = useRef(null); // store socket instance

  // ✅ Initialize socket only once when userId exists
  useEffect(() => {
    if (!userId) return;

    socketRef.current = getSocket(userId);

    return () => {
      socketRef.current?.disconnect(); // cleanup on unmount or user change
    };
  }, [userId]);

  // ✅ Fetch chat history
  const { data: history = [], isLoading } = useGetChatHistoryQuery(responseId, {
    skip: !responseId,
  });

  // ✅ Load initial history
  useEffect(() => {
    setLiveMessages(history?.data || []);
  }, [history]);

  // ✅ Join room & listen for events
  useEffect(() => {
    const socket = socketRef.current;
    if (!responseId || !userId || !socket) return;

    socket.emit('joinRoom', { responseId, userId });

    const handleMessage = (data) => setLiveMessages((prev) => [...prev, data]);
    const handleUnread = (msgs) => {
      setLiveMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        return [...prev, ...msgs.filter((m) => !existingIds.has(m._id))];
      });
    };
    const handleRead = ({ messageId, userId: readerId }) => {
      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, readBy: [...new Set([...(msg.readBy || []), readerId])] }
            : msg
        )
      );
    };

    socket.on('message', handleMessage);
    socket.on('unread-messages', handleUnread);
    socket.on('message-read', handleRead);

    return () => {
      socket.off('message', handleMessage);
      socket.off('unread-messages', handleUnread);
      socket.off('message-read', handleRead);
    };
  }, [responseId, userId]);

  // ✅ Send message
  const sendMessage = () => {
    const socket = socketRef.current;
    if (message.trim() && socket) {
      socket.emit('message', { responseId, from: userId, message });
      setMessage('');
    }
  };

  // ✅ Emit read receipts for unseen messages
  // useEffect(() => {
  //   const socket = socketRef.current;
  //   if (!responseId || !userId || !socket) return;

  //   liveMessages.forEach((m) => {
  //     const senderId = typeof m.from === 'object' ? m.from._id : m.from;
  //     if (!m.readBy?.includes(userId) && senderId !== userId) {
  //       socket.emit('message-read', {
  //         responseId,
  //         messageId: m._id,
  //         userId,
  //       });
  //     }
  //   });
  // }, [liveMessages, responseId, userId]);


  useEffect(() => {
    if (!socketRef.current || !userId || !responseId) return;

    const unreadMessages = liveMessages.filter((m) => {
      const senderId = typeof m.from === 'object' ? m.from._id : m.from;
      return senderId !== userId && !m.readBy?.includes(userId);
    });

    unreadMessages.forEach((m) => {
      socketRef.current.emit('message-read', {
        responseId,
        messageId: m._id,
        userId,
      });
    });
  }, [liveMessages, responseId, userId]);




  const messageBoxRef = useRef(null);

  // ✅ Auto-scroll when new messages arrive
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [liveMessages]);

  return (
    <div>
      {/* Messages */}
      <div
        className="h-64 overflow-y-auto border rounded py-3 px-2 space-y-2"
        ref={messageBoxRef}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin w-5 h-5" />
          </div>
        ) : liveMessages.length === 0 ? (
          <div className="text-center text-sm text-gray-500">
            Currently there is no messages
          </div>
        ) : (
          liveMessages.map((m, i) => {
            const senderId = typeof m.from === 'object' ? m.from._id : m.from;
            const isCurrentUser = senderId === userId;
            const seenByOthers =
              isCurrentUser && m.readBy?.some((id) => id !== userId);

            return (
              <div
                key={m._id || i}
                className={`flex items-center gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'justify-start'
                  }`}
              >
                <Image
                  src={m?.from?.profile?.profilePicture || userDummyImage}
                  alt={m?.from?.profile?.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10 border border-gray-300"
                />
                <div className="flex flex-col items-end gap-0.5">
                  <p
                    className={`text-[11px] ${isCurrentUser ? 'text-right' : ''
                      }`}
                  >
                    {dayjs(m.createdAt).locale('en-short').fromNow()}
                  </p>
                  <div
                    className={`rounded p-2 ${isCurrentUser
                      ? 'bg-[var(--secondary-color)] text-right'
                      : 'bg-gray-300 text-left'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p
                        className={`text-xs font-semibold ${isCurrentUser ? 'text-white' : ''
                          }`}
                      >
                        {isCurrentUser
                          ? 'You'
                          : typeof m.from === 'object'
                            ? m.from.profile?.name || m.from._id
                            : m.from}
                      </p>
                    </div>
                    <div
                      className={`text-sm ${isCurrentUser ? 'text-white' : ''}`}
                    >
                      {m.message}
                    </div>
                  </div>

                  {isCurrentUser && seenByOthers && (
                    <div className="text-xs text-black mt-1">Seen</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 border p-2 rounded placeholder:text-xs"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-[var(--secondary-color)] text-white px-4 py-2 rounded"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

