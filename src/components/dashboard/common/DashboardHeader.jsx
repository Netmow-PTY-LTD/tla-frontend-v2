'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProfileDropDown from './ProfileDropDown';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { BadgeCent, PanelLeft } from 'lucide-react';
import { useGetNotificationsQuery } from '@/store/features/notification/notificationApiService';
import NotificationDropdown from './NotificationDropdown';
import { useGetUserCreditStatsQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import EliteProBadge from '@/components/icon/EliteProBadge';
import { Sub } from '@radix-ui/react-dropdown-menu';
import SubscriptionBadge from '@/components/icon/SubscriptionBadge';
import { useGetSettingsQuery } from '@/store/features/admin/appSettings';

export default function DashboardHeader({ onToggleSidebar }) {
  const userInfo = useSelector(selectCurrentUser);
  const { data } = useGetNotificationsQuery({ read: false });
  //const { data: credits } = useGetUserCreditStatsQuery();

  const { data: appSettings } = useGetSettingsQuery();

  const appData = appSettings?.data || {};

  const { data: currentUser } = useAuthUserInfoQuery();

  // console.log('userInfo', userInfo);
  //console.log('currentUser', currentUser);

  const isElitePro = currentUser?.data?.profile?.isElitePro;
  const eliteProId = currentUser?.data?.profile?.eliteProSubscriptionId;
  const subscriptionId = currentUser?.data?.profile?.subscriptionId;
  const credits = currentUser?.data?.profile?.credits;

  return (
    <header className="db-header">
      <div className="db-header-container flex gap-4">
        <Link href="/lawyer/dashboard" className="db-logo">
          <Image
            src={appData?.appLogo || '/assets/img/logo.png'}
            alt={appData?.siteName || 'TLA Logo'}
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
      <div className="flex items-center gap-2">
        {/* Elite Pro */}
        {isElitePro === true && eliteProId && eliteProId !== null && (
          <div className="border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
            {/* <Image
              src={'/assets/img/elite-pro-badge.svg'}
              alt="Elite Pro"
              width={40}
              height={40}
              className="w-5 h-5 object-cover"
            /> */}
            <EliteProBadge className="w-5 h-5" />
          </div>
        )}
        {subscriptionId && subscriptionId !== null && (
          <div className="border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
            {/* <Image
              src={'/assets/img/subscription-badge.svg'}
              alt="Subscription"
              width={40}
              height={40}
              className="w-5 h-5 object-cover"
            /> */}
            <SubscriptionBadge className="w-5 h-5" />
          </div>
        )}
        {/* Remaining Credits */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-1 shadow-sm h-8">
          <BadgeCent className="w-6 h-6 text-primary" />
          <span className="text-sm font-semibold text-gray-800">
            {credits ?? 0}
          </span>
        </div>

        <button className="w-8 h-8 items-center justify-center border border-gray-300 rounded-full hidden sm:flex cursor-pointer flex-shrink-0">
          <NotificationDropdown />
        </button>
        <ProfileDropDown data={userInfo} />
      </div>
    </header>
  );
}
