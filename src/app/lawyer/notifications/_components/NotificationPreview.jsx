
'use client'

import WhatsApp from '@/components/icon/WhatsApp';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AtSign,
  BadgeCent,
  BadgeCheck,
  BadgeX,
  Bell,
  CalendarCheck,
  Delete,
  Edit,
  Loader2,
  LogIn,
  Mail,
  MailCheck,
  MessageSquare,
  MoveLeft,
  Phone,
  PhoneCall,
  PhoneOutgoing,
  PlusCircle,
  Rss,
  Send,
  Tag,
  Trash2,
} from 'lucide-react';

const { useGetNotificationsQuery, useMarkAsRedNotificationMutation } = require("@/store/features/notification/notificationApiService");

dayjs.extend(relativeTime);

export default function NotificationPreview() {
  const { data } = useGetNotificationsQuery({ read: 'any' });
  const [markAsRead] = useMarkAsRedNotificationMutation();

  const generateActivityIcon = (type) => {
    const iconStyles = {
      login: { Icon: LogIn, fill: '#3B82F6' }, // Blue
      update: { Icon: Edit, fill: '#F59E0B' }, // Amber/Yellow
      delete: { Icon: Trash2, fill: '#EF4444' }, // Red
      create: { Icon: PlusCircle, fill: '#10B981' }, // Green
      schedule: { Icon: CalendarCheck, fill: '#6366F1' }, // Indigo
      sendsms: { Icon: Send, fill: '#0EA5E9' }, // Sky blue
      contact: { Icon: PhoneCall, fill: '#8B5CF6' }, // Violet
      sendemail: { Icon: Mail, fill: '#2563EB' }, // Blue
      whatsapp: { Icon: WhatsApp, fill: '#25D366' }, // WhatsApp green
      status: { Icon: BadgeCheck, fill: '#22C55E' }, // Success green
      other: { Icon: Bell, fill: '#6B7280' }, // Gray
    };

    const { Icon, fill } = iconStyles[type] || iconStyles.other;

    return <Icon className="w-5 h-5 mr-2 inline" stroke={fill} />;
  };


  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      // Optionally, you can refetch or update local cache if needed here
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };



  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Notifications</h2>
      <ul>
        {data?.data?.map(n => (
          <li key={n._id} className="mb-2 border p-3 rounded bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {generateActivityIcon(n.type)}
                <p className="font-medium">{n.title}</p>
              </div>
              <div className="flex items-center space-x-3">
                {!n.isRead && <span className="text-xs text-red-500"> {dayjs(n.createdAt).fromNow()}</span>}
                {!n.isRead && (
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => handleMarkAsRead(n._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
