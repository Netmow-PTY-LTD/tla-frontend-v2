'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  BadgeCheck,
  Bell,
  BellRing,
  CalendarCheck,
  Edit,
  LogIn,
  Mail,
  PhoneCall,
  PlusCircle,
  Send,
  Trash2,
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import {
  useGetNotificationsQuery,
  useMarkAsRedNotificationMutation,
} from '@/store/features/notification/notificationApiService';
import { useNotifications } from '@/hooks/useSocketListener';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';

dayjs.extend(relativeTime);

const iconStyles = {
  login: { Icon: LogIn, fill: '#3B82F6' }, // Blue
  update: { Icon: Edit, fill: '#F59E0B' }, // Amber/Yellow
  delete: { Icon: Trash2, fill: '#EF4444' }, // Red
  create: { Icon: PlusCircle, fill: '#10B981' }, // Green
  schedule: { Icon: CalendarCheck, fill: '#6366F1' }, // Indigo
  sendsms: { Icon: Send, fill: '#0EA5E9' }, // Sky blue
  contact: { Icon: PhoneCall, fill: '#8B5CF6' }, // Violet
  sendemail: { Icon: Mail, fill: '#2563EB' }, // Blue
  whatsapp: { Icon: Bell, fill: '#25D366' }, // WhatsApp green
  status: { Icon: BadgeCheck, fill: '#22C55E' }, // Success green
  other: { Icon: Bell, fill: '#6B7280' }, // Gray
};

const generateActivityIcon = (type) => {
  const { Icon, fill } = iconStyles[type] || iconStyles.other;

  return <Icon className="w-5 h-5 inline" stroke={'#fff'} />;
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentUser = useSelector(selectCurrentUser);

  const { data, isLoading, refetch } = useGetNotificationsQuery({
    read: false,
  });
  const [markAsRead] = useMarkAsRedNotificationMutation();
  const notifications = data?.data || [];

  useNotifications(
    currentUser?._id,
    useCallback(
      (data) => {
        console.log('🔔 Notification Lawyer Dashboard:', data);
        if (data?.userId) {
          refetch();
        }
      },
      [refetch]
    )
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (n) => {
    setIsOpen(false);
    if (!n.read) {
      await markAsRead(n._id); // call mutation to mark as read
    }
    // Optional: route to the link
    if (n.link) {
      window.location.href = n.link;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="cursor-pointer relative"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <BellRing className="w-5 h-5 text-[#919FAC]" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5">
            {notifications.length}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 bg-white shadow-[0_6px_16px_#0006] rounded-lg w-80 mt-2 z-[99]">
          <h4 className="font-semibold text-gray-800 py-3 px-4 text-left border-b">
            Notifications
          </h4>
          <ul className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <li className="p-4 text-sm text-gray-500">Loading...</li>
            ) : notifications.length > 0 ? (
              <>
                {notifications.slice(0, 10).map((n) => (
                  <li
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className="flex items-start gap-3 border-b p-4 hover:bg-gray-100 cursor-pointer text-left"
                  >
                    {(() => {
                      const iconStyle = iconStyles[n?.type] || iconStyles.other;
                      return (
                        <div
                          className="icon w-[32px] h-[32px] rounded-full flex justify-center items-center flex-shrink-0"
                          style={{ backgroundColor: iconStyle.fill }}
                        >
                          {n?.type && generateActivityIcon(n?.type)}
                        </div>
                      );
                    })()}
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{n.title}</div>
                      <p className="text-xs text-gray-500">{n.message}</p>
                      <p className="text-[10px] text-gray-400">
                        {dayjs(n.createdAt).fromNow()}
                      </p>
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">
                No notifications
              </li>
            )}
          </ul>
          <div className="text-center py-2">
            <Link
              href="/lawyer/notifications"
              className="text-blue-500 text-sm hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
