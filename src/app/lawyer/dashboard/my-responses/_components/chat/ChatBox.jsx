'use client';

import { getSocket } from '@/lib/socket';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';



export default function ChatBox({ response }) {

    const responseId=response?._id

    const userId = useSelector(selectCurrentUser)?._id;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socket = getSocket(userId);
    useEffect(() => {
        if (!responseId || !userId) return;

        socket.emit('joinRoom', { responseId, userId });

        socket.on('message', (data) => {
            if (data.responseId === responseId) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off('message');
        };
    }, [responseId, userId]);

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
            <div className="h-64 overflow-y-auto border rounded p-4 space-y-2">
                {messages.map((m, i) => {
                    const isCurrentUser = m.from === userId; // 👈 Replace with your actual currentUserId

                    return (
                        <div
                            key={i}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`rounded p-2 max-w-[70%] ${isCurrentUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
                                    }`}
                            >
                                <div className="text-sm font-semibold">
                                    {isCurrentUser ? 'You' : m.from}
                                </div>
                                <div>{m.message}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2 mt-4">
                <input
                    className="flex-1 border p-2 rounded"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Send
                </button>
            </div>
        </div>
    );
}