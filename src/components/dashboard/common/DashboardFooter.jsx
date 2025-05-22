'use client';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

export default function DashboardFooter() {
  const currentUser = useSelector(selectCurrentUser);

  const homeUrl =
    currentUser?.role === 'user' && currentUser?.regUserType === 'lawyer'
      ? '/lawyer/dashboard'
      : currentUser?.role === 'user' && currentUser?.regUserType === 'client'
      ? '/client/dashboard'
      : '/admin';
  return (
    <footer className="db-footer bg-[#F3F3F3]">
      <div className="container">
        <p className="font-semibold">
          Copyright &copy; {new Date().getFullYear()} |{' '}
          <Link href={homeUrl}>The LawAppOnline</Link>.
        </p>
      </div>
    </footer>
  );
}
