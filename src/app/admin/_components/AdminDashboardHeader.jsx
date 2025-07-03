'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import AdminProfileDropDown from './AdminProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { BellRing } from 'lucide-react';

export default function AdminDashboardHeader() {
  const { data: currentUser } = useAuthUserInfoQuery();

  return (
    <header className="db-header">
      <div className="db-header-container">
        <Link href="/admin">
          <Image
            src={'/assets/img/logo.png'}
            alt="TLA Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="#"
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full"
        >
          <BellRing className="w-6 h-6 text-gray-500" />
        </Link>
        <AdminProfileDropDown data={currentUser?.data ?? []} />
      </div>
    </header>
  );
}
