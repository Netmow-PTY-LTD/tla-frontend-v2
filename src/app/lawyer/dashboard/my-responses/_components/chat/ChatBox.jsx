
'use client';

import { getSocket } from '@/lib/socket';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGetChatHistoryQuery } from '@/store/features/lawyer/ResponseApiService';

export default function ChatBox({ response }) {
  const responseId = response?._id;
  const userId = useSelector(selectCurrentUser)?._id;
  const [message, setMessage] = useState('');
  const [liveMessages, setLiveMessages] = useState([]); // only for socket messages
  const socket = getSocket(userId);

  // ✅ Fetch old messages from RTK Query
  const { data: history = [], isLoading } = useGetChatHistoryQuery(responseId, {
    skip: !responseId, // don't run if no responseId
  });

  useEffect(() => {
   
    setLiveMessages(history?.data)
 
  }, [history,responseId]);


  // ✅ Join room + listen for new messages
  useEffect(() => {
    if (!responseId || !userId) return;

    socket.emit('joinRoom', { responseId, userId });

    socket.on('message', (data) => {
      if (data.responseId === responseId) {
        setLiveMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [responseId, userId, socket]);

  // ✅ Send message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', {
        responseId,
        from: userId,
        message,
      });
      setMessage('');
    }
  };



  return (
    <div>
      {/* Messages container */}
      <div className="h-64 overflow-y-auto border rounded p-4 space-y-2">
        {isLoading ? (
          <div>Loading messages...</div>
        ) : (
          Array.isArray(liveMessages) &&
          liveMessages.map((m, i) => {
            const isCurrentUser =
              typeof m.from === 'object' ? m.from._id === userId : m.from === userId;

            return (
              <div
                key={i}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded p-2 max-w-[70%] ${
                    isCurrentUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
                  }`}
                >
                  <div className="text-sm font-semibold">
                    {isCurrentUser
                      ? 'You'
                      : typeof m.from === 'object'
                      ? m.from.name || m.from._id
                      : m.from}
                  </div>
                  <div>{m.message}</div>
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
