'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import Cookies from 'js-cookie';

export default function DashboardHeader() {
  const { data: userInfo, isLoading } = useAuthUserInfoQuery();
  return (
    <header className="db-header">
      <div className="db-header-container">
        <Link href="/lawyer/dashboard">
          <Image
            src={'/assets/img/logo.png'}
            alt="TLA Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <ProfileDropDown data={userInfo?.data} />
    </header>
  );
}
