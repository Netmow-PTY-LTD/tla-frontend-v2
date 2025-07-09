'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { BellRing, PanelLeft } from 'lucide-react';
import { useSidebarToggle } from '@/contexts/SidebarToggleContext';

export default function DashboardHeader({ onToggleSidebar }) {
  const userInfo = useSelector(selectCurrentUser);

  return (
    <header className="db-header">
      <div className="db-header-container flex">
        <Link href="/lawyer/dashboard">
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
        <Link
          href="#"
          className="w-10 h-10 items-center justify-center border border-gray-300 rounded-full hidden sm:flex"
        >
          <BellRing className="w-6 h-6 text-gray-500" />
        </Link>
        <ProfileDropDown data={userInfo} />
      </div>
    </header>
  );
}
