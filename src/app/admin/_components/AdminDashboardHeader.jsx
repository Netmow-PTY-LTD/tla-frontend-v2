'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import AdminProfileDropDown from './AdminProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';

export default function AdminDashboardHeader() {
  const { data: userInfo, isLoading } = useAuthUserInfoQuery();
  console.log('userInfo', userInfo);
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
      <AdminProfileDropDown data={userInfo?.data} />
    </header>
  );
}
