
"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import {

    useGetNotificationsQuery,
  useMarkAsRedNotificationMutation,
} from "@/store/features/notification/notificationApiService";

dayjs.extend(relativeTime);

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data, isLoading } = useGetNotificationsQuery({ read: false });
  const [markAsRead] = useMarkAsRedNotificationMutation();
  const notifications = data?.data || [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (n) => {
    setIsOpen(false);
    if (!n.read) {
      await markAsRead(n._id); // call mutation to mark as read
    }
    // Optional: route to the link
    // if (n.link) {
    //   window.location.href = n.link;
    // }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="cursor-pointer relative"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5">
            {notifications.length}
          </span>
        )}
      </div>

      {isOpen && (
        <ul className="absolute right-0 bg-white shadow rounded w-72 mt-2 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <li className="px-3 py-2 text-sm text-gray-500">Loading...</li>
          ) : notifications.length > 0 ? (
            <>
              {notifications.slice(0, 5).map((n) => (
                <li
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className="border-b px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-sm font-medium">{n.title}</div>
                  <p className="text-xs text-gray-500">{n.message}</p>
                  <p className="text-[10px] text-gray-400">
                    {dayjs(n.createdAt).fromNow()}
                  </p>
                </li>
              ))}
              <li className="text-center py-2">
                <Link
                  href="/lawyer/notifications"
                  className="text-blue-500 text-sm hover:underline"
                >
                  View all
                </Link>
              </li>
            </>
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">
              No notifications
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
