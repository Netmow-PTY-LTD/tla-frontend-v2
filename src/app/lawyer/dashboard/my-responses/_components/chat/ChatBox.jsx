

'use client';

import { getSocket } from '@/lib/socket';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGetChatHistoryQuery } from '@/store/features/lawyer/ResponseApiService';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
export default function ChatBox({ response }) {
  const responseId = response?._id;
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?._id;
  const [message, setMessage] = useState('');
  const [liveMessages, setLiveMessages] = useState([]);
  const socket = getSocket(userId);

  // ✅ Fetch old messages
  const { data: history = [], isLoading } = useGetChatHistoryQuery(responseId, {
    skip: !responseId,
  });

  console.log('messsage ==>',liveMessages)
  // ✅ Load initial history
  useEffect(() => {
    setLiveMessages(history?.data || []);
  }, [history, responseId]);

  // ✅ Join room and listen for events (including unread messages)
  useEffect(() => {
    if (!responseId || !userId) return;

    socket.emit('joinRoom', { responseId, userId });

    socket.on('message', (data) => {
      // Append new incoming messages
      setLiveMessages((prev) => [...prev, data]);
    });

    socket.on('unread-messages', (msgs) => {
      // Merge unread messages without duplicates
      setLiveMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const newOnes = msgs.filter((m) => !existingIds.has(m._id));
        return [...prev, ...newOnes];
      });
    });

    socket.on('message-read', ({ messageId, userId: readerId }) => {
      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, readBy: [...new Set([...(msg.readBy || []), readerId])] }
            : msg
        )
      );
    });

    return () => {
      socket.off('message');
      socket.off('unread-messages');
      socket.off('message-read');
    };
  }, [responseId, userId, socket]);

  // ✅ Send message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { responseId, from: userId, message });
      setMessage('');
    }
  };

  // ✅ Emit read receipts for unseen messages
  useEffect(() => {
    if (!responseId || !userId) return;

    liveMessages.forEach((m) => {
      const senderId = typeof m.from === 'object' ? m.from._id : m.from;
      if (!m.readBy?.includes(userId) && senderId !== userId) {
        socket.emit('message-read', {
          responseId,
          messageId: m._id,
          userId,
        });
      }
    });
  }, [liveMessages, responseId, userId, socket]);

  return (
    <div>
      {/* Messages */}
      <div className="h-64 overflow-y-auto border rounded p-4 space-y-2">
        {isLoading ? (
          <div>Loading messages...</div>
        ) : (
          liveMessages.map((m, i) => {
            const senderId = typeof m.from === 'object' ? m.from._id : m.from;
            const isCurrentUser = senderId === userId;
            const seenByOthers =
              isCurrentUser && m.readBy?.some((id) => id !== userId);

            return (
              <div
                key={m._id || i}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded p-2 max-w-[90%] ${
                    isCurrentUser
                      ? 'bg-blue-100 text-right'
                      : 'bg-gray-100 text-left'
                  }`}
                >
                 <div className='flex items-center justify-between gap-4'>
                    <p>{dayjs(m.createdAt).fromNow()}</p>
                   <p className="text-sm font-semibold">
                    {isCurrentUser
                      ? 'You'
                      : typeof m.from === 'object'
                      ? m.from.profile?.name || m.from._id
                      : m.from}
                  </p>
                 
                 </div>
                  <div>{m.message}</div>
                  {isCurrentUser && seenByOthers && (
                    <div className="text-xs text-blue-500 mt-1">Seen</div>
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
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
