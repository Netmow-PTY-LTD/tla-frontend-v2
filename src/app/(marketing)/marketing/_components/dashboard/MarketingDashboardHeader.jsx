'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { BellRing, PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import MarketingProfileDropDown from './MarketingProfileDropDown';


export default function MarketingDashboardHeader({ onToggleSidebar }) {
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  const token = Cookies.get('token');
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useAuthUserInfoQuery(undefined, {
      skip: !token,
    });

  //

  return (
    <header className="db-header">
      <div className="db-header-container flex gap-4">
        <Link href="/admin" className="db-logo">
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
      <div className="flex items-center gap-4">
        <Link
          href="#"
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full flex-shrink-0"
        >
          <BellRing className="w-5 h-5 text-gray-500" />
        </Link>
        <MarketingProfileDropDown
          data={currentUser?.data ?? []}
          isCurrentUserLoading={isCurrentUserLoading}
        />
      </div>
    </header>
  );
}
