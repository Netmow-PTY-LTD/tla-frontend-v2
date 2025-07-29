'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { PanelLeft } from 'lucide-react';
import { useGetNotificationsQuery } from '@/store/features/notification/notificationApiService';
import NotificationDropdown from './NotificationDropdown';

export default function DashboardHeader({ onToggleSidebar }) {
  const userInfo = useSelector(selectCurrentUser);
  const { data } = useGetNotificationsQuery({ read: false });

  return (
    <header className="db-header">
      <div className="db-header-container flex gap-4">
        <Link href="/lawyer/dashboard" className="db-logo">
          <Image
            src={'/assets/img/logo.png'}
            alt="TLA Logo"
            width={150}
            height={40}
          />
        </Link>
        <button
          data-sidebar-toggle
          onClick={() => onToggleSidebar()}
          className="xl:hidden"
        >
          <PanelLeft />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 items-center justify-center border border-gray-300 rounded-full hidden sm:flex cursor-pointer">
          <NotificationDropdown />
        </button>
        <ProfileDropDown data={userInfo} />
      </div>
    </header>
  );
}
