'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BuyerProfileDropDown from './BuyerProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { PanelLeft } from 'lucide-react';

import NotificationDropdownClient from '@/components/dashboard/common/NotificationDropdownClient';

export default function BuyerDashboardHeader({ onToggleSidebar }) {
  const { data: userInfo, isLoading } = useAuthUserInfoQuery();

  return (
    <header className="db-header">
      <div className="db-header-container flex items-center gap-4">
        <Link href="/client/dashboard" className="db-logo">
          <img
            src={'/assets/img/logo-tla.svg'}
            alt={'TLA Logo'}
            className="h-[48px]"
          />
        </Link>
        <button
          data-sidebar-toggle
          onClick={() => onToggleSidebar()}
          className="xl:hidden"
        >
          <PanelLeft className="w-5 h-6 text-gray-800" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <NotificationDropdownClient />
        <BuyerProfileDropDown data={userInfo?.data ?? []} />
      </div>
    </header>
  );
}
