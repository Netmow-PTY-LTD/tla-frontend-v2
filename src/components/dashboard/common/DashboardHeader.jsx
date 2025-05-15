'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';

export default function DashboardHeader() {
  const userInfo = useSelector(selectCurrentUser);
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
      <ProfileDropDown data={userInfo} />
    </header>
  );
}
