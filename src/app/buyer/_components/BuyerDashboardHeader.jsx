'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BuyerProfileDropDown from './BuyerProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';

export default function BuyerDashboardHeader() {
  const { data: userInfo, isLoading } = useAuthUserInfoQuery();

  return (
    <header className="db-header">
      <div className="db-header-container">
        <Link href="/buyer/dashboard">
          <Image
            src={'/assets/img/logo.png'}
            alt="TLA Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <BuyerProfileDropDown data={userInfo?.data} />
    </header>
  );
}
