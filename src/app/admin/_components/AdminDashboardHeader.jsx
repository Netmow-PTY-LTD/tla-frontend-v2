'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import AdminProfileDropDown from './AdminProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/auth/authSlice';

export default function AdminDashboardHeader() {
  const currentUser = useSelector(selectCurrentUser);

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
      <AdminProfileDropDown data={currentUser} />
    </header>
  );
}
