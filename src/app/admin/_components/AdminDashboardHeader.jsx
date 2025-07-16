'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import AdminProfileDropDown from './AdminProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { BellRing, PanelLeft } from 'lucide-react';

export default function AdminDashboardHeader({ onToggleSidebar }) {
  const { data: currentUser } = useAuthUserInfoQuery();

  return (
    <header className="db-header">
      <div className="db-header-container flex">
        <Link href="/admin">
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
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
        >
          <BellRing className="w-5 h-5 text-gray-500" />
        </Link>
        <AdminProfileDropDown data={currentUser?.data ?? []} />
      </div>
    </header>
  );
}
