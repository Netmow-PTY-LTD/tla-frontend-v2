'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { BadgeCent, PanelLeft } from 'lucide-react';
import { useGetNotificationsQuery } from '@/store/features/notification/notificationApiService';
import NotificationDropdown from './NotificationDropdown';
import { useGetUserCreditStatsQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';

export default function DashboardHeader({ onToggleSidebar }) {
  const userInfo = useSelector(selectCurrentUser);
  const { data } = useGetNotificationsQuery({ read: false });
  const { data: credits } = useGetUserCreditStatsQuery();

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
        {/* Remaining Credits */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 shadow-sm">
          <BadgeCent className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-gray-800">
            {credits?.data?.remainingCredits ?? 0}
          </span>
        </div>

        <button className="w-8 h-8 items-center justify-center border border-gray-300 rounded-full hidden sm:flex cursor-pointer flex-shrink-0">
          <NotificationDropdown />
        </button>
        <ProfileDropDown data={userInfo} />
      </div>
    </header>
  );
}
