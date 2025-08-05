'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import AdminProfileDropDown from './AdminProfileDropDown';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { BellRing, PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ResponseSkeleton from '@/app/lawyer/dashboard/my-responses/_components/ResponseSkeleton';
import { getUserFromToken } from '@/helpers/auth';

export default function AdminDashboardHeader({ onToggleSidebar }) {
  const [user, setUser] = React.useState(null);
  const router = useRouter();

  const token = Cookies.get('token');
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useAuthUserInfoQuery(undefined, {
      skip: !token,
    });

  // useEffect(() => {
  //   if (!currentUser || currentUser?.data?.regUserType !== 'admin') {
  //     //showErrorToast('Access denied. Please login as admin.');
  //     const target =
  //       currentUser?.data?.regUserType === 'client'
  //         ? '/client/dashboard'
  //         : '/lawyer/dashboard';
  //     router.push(target);
  //   }
  // }, [currentUser, isCurrentUserLoading, router]);

  // if (isCurrentUserLoading) return <ResponseSkeleton />;

  // useEffect(() => {
  //   const fetchedUser = async () => {
  //     if (!token) {
  //       router.push('/login');
  //       return;
  //     }

  //     const user = await getUserFromToken(token);
  //     console.log('user', user);
  //     setUser(user);

  //     if (!user || user?.regUserType !== 'admin') {
  //       const target =
  //         user?.regUserType === 'client'
  //           ? '/client/dashboard'
  //           : '/lawyer/dashboard';
  //       router.push(target);
  //     }
  //   };

  //   fetchedUser();
  // }, [token]);

  return (
    <header className="db-header">
      <div className="db-header-container flex gap-4">
        <Link href="/admin" className="db-logo">
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
        <AdminProfileDropDown
          data={currentUser?.data ?? []}
          isCurrentUserLoading={isCurrentUserLoading}
        />
      </div>
    </header>
  );
}
