'use client';

import WhatsApp from '@/components/icon/WhatsApp';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  AtSign,
  BadgeCent,
  BadgeCheck,
  BadgeX,
  Bell,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
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
import { Fragment, useState } from 'react';

const {
  useGetNotificationsQuery,
  useMarkAsRedNotificationMutation,
} = require('@/store/features/notification/notificationApiService');

dayjs.extend(relativeTime);

export default function NotificationPreview() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data } = useGetNotificationsQuery();
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

    return <Icon className="w-5 h-5 inline" stroke={fill} />;
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      // Optionally, you can refetch or update local cache if needed here
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  // calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data?.data?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil((data?.data?.length || 0) / itemsPerPage);

  const groupedData = [];

  paginatedData?.forEach((item) => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).formatToParts(new Date(item.createdAt));

    const formattedDate = parts
      .filter(({ type }) => ['weekday', 'day', 'month'].includes(type))
      .map(({ value }) => value)
      .join(' '); // e.g., "Mon 14 Jul"

    const existingGroup = groupedData?.find(
      (group) => group.date === formattedDate
    );
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      groupedData.push({ date: formattedDate, items: [item] });
    }
  });

  function getPageNumbers(currentPage, totalPages) {
    const visiblePages = [];

    if (totalPages <= 10) {
      // Show all pages if 10 or less
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always show first 3
      visiblePages.push(1, 2, 3);

      if (currentPage > 6) {
        visiblePages.push('...');
      }

      // Show middle pages
      const start = Math.max(4, currentPage - 1);
      const end = Math.min(totalPages - 3, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!visiblePages.includes(i)) visiblePages.push(i);
      }

      if (currentPage < totalPages - 5) {
        visiblePages.push('...');
      }

      // Show last 3
      visiblePages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return visiblePages;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  //console.log('data', data?.data);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Notifications</h2>
      <div className="max-w-[1100px] mx-auto">
        {/* <ul>
          {paginatedData?.map((n) => (
            <li key={n._id} className="mb-2 border p-3 rounded bg-white">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  {generateActivityIcon(n.type)}
                  <div>
                    <p className="font-medium leading-none">{n.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-red-500">
                    {' '}
                    {dayjs(n.createdAt).fromNow()}
                  </span>
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
            </li>
          ))}
        </ul> */}

        <div className="bg-white rounded-lg relative p-4">
          {groupedData.map((group, groupIndex) => (
            <Fragment key={groupIndex}>
              <div
                className={`activity-log-date-item text-sm font-medium text-gray-500 pb-2 text-center ml-[16px] ${
                  groupIndex === 0 ? '' : 'border-l border-[#e6e7ec]'
                }`}
              >
                {group.date}
              </div>

              {group.items.map((n, index) => (
                <div
                  key={n._id}
                  className={`activity-log-item flex gap-2 ${
                    groupIndex === 0 && index === 0 ? 'first-log-item' : ''
                  }`}
                >
                  <div className="left-track flex-grow-0 flex flex-col w-[32px] items-center">
                    <div className="line-top h-1/2 w-[1] border-l border-[#e6e7ec]"></div>
                    <div className="icon-wrapper mt-[-16px]">
                      <div className="icon w-[32px] h-[32px] bg-[#000] rounded-full flex justify-center items-center">
                        {n?.type && generateActivityIcon(n?.type)}
                      </div>
                    </div>
                    <div className="line-bottom h-1/2 w-[1] border-l border-[#e6e7ec]"></div>
                  </div>

                  <div className="flex-1 flex items-start justify-between mb-4 py-3 px-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col">
                      <div className="text-gray-500">{n.title || ''}</div>
                      <div className="text-sm text-black font-medium">
                        {n?.message}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(n?.createdAt)
                        .toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                        .replace(/ (AM|PM)/, '')}
                    </span>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
        {paginatedData?.length === 0 && <p>No notifications found.</p>}
        {paginatedData?.length > 0 && (
          <div className="flex justify-center gap-1 mt-10 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-80"
            >
              Prev
            </button>

            {pageNumbers.map((page, index) =>
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border border-gray-300 rounded ${
                    currentPage === page ? 'bg-black text-white' : ''
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-80"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
