'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      setIsRegistered(false);
    });

    newSocket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    newSocket.on('users-update', (users) => {
      setConnectedUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const registerUser = () => {
    if (socket && userId.trim()) {
      socket.emit('register-user', userId.trim());
      setIsRegistered(true);
    }
  };

  const sendUserMessage = () => {
    if (socket && message.trim() && targetUserId.trim()) {
      socket.emit('send-user-message', {
        targetUserId: targetUserId.trim(),
        message: message.trim()
      });
      setMessage('');
    }
  };

  const sendBroadcast = () => {
    if (socket && message.trim()) {
      socket.emit('send-broadcast', message.trim());
      setMessage('');
    }
  };

  if (!isRegistered) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">User-wise Real-time Notifications</h1>

        <div className="mb-4">
          Status:{' '}
          <span className={connected ? 'text-green-600' : 'text-red-600'}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Register Your User ID:</h2>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            className="border p-2 mr-2"
            onKeyPress={(e) => e.key === 'Enter' && registerUser()}
          />
          <button
            onClick={registerUser}
            disabled={!connected || !userId.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User-wise Real-time Notifications</h1>

      <div className="mb-4">
        <div>
          Status:{' '}
          <span className={connected ? 'text-green-600' : 'text-red-600'}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div>Your ID: <span className="font-semibold">{userId}</span></div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Connected Users:</h2>
        <div className="text-sm text-gray-600">
          {connectedUsers.length > 0 ? connectedUsers.join(', ') : 'No users connected'}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Send Message:</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          className="border p-2 mr-2 mb-2"
        />
        <br />
        <input
          type="text"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          placeholder="Target user ID (leave empty for broadcast)"
          className="border p-2 mr-2 mb-2"
        />
        <br />
        <button
          onClick={sendUserMessage}
          disabled={!message.trim() || !targetUserId.trim()}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
        >
          Send to User
        </button>
        <button
          onClick={sendBroadcast}
          disabled={!message.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Broadcast to All
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Notifications:</h2>
        <div className="space-y-2">
          {notifications.map((notif, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded">
              {notif}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
