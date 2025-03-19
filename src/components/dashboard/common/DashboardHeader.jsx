import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';

export default function DashboardHeader() {
  return (
    <header className="db-header">
      <div className="db-header-container">
        <Link href="/dashboard/client">
          <Image
            src={'/assets/img/logo.png'}
            alt="TLA Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <ProfileDropDown />
    </header>
  );
}
