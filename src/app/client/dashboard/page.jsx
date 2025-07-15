'use client';

import React from 'react';
import Link from 'next/link';
import PencilIcon from '@/assets/icon';
import ProfileCard from '@/components/dashboard/lawyer/module/MyStats/ProfileCard';
import StatusCard from '@/components/dashboard/lawyer/components/StatusCard';
import { Card } from '@/components/ui/card';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useGetLeadServiceListQuery } from '@/store/features/leadService/leadServiceApiService';
import LeadSettings from '@/components/dashboard/lawyer/components/LeadSettings';
import LeadStatsCard from '@/components/dashboard/lawyer/module/MyStats/LeadStatsCard';

export default function BuyerDashboard() {
  const menuLinks = [
    { label: 'All Time', href: '#/all-time' },
    { label: 'Today', href: '#/today' },
    { label: 'This Week', href: '#/this-week' },
    { label: 'This Month', href: '#/this-month' },
  ];

  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    isError: isErrorUserInfo,
    error: errorUserInfo,
  } = useAuthUserInfoQuery(undefined, { refetchOnMountOrArgChange: true });

  const {
    data: leadServicesData,
    isLoading: isLoadingLeadServices,
    isError: isErrorLeadServices,
    error: errorLeadServices,
  } = useGetLeadServiceListQuery();

  const profileData = userInfo?.data ?? {};
  const bio = profileData?.profile?.bio?.trim();
  const fallbackBio =
    "If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options.";

  return (
    <div className="lg:m-4 w-full">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="font-bold heading border-b border-1 text-[#0B1C2D] pb-4">
          Overview of Your Stats
        </h2>

        <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Column */}
          <div className="flex flex-col h-full">
            <ProfileCard
              profile={profileData}
              isLoading={isLoadingUserInfo}
              isError={isErrorUserInfo}
              error={errorUserInfo}
              className="flex-1"
            />

            {/* 🟢 This card should stretch to fill remaining height */}
            <Card className="mt-5 p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-medium flex items-center text-lg">
                  Lead Notifications
                  <Link
                    href={'/lawyer/settings/notifications'}
                    aria-label="Edit Notification Email"
                    className="ml-3 rounded"
                  >
                    <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
                  </Link>
                </h2>
                <p className="my-2 text-sm sm:text-base font-medium">
                  Sending new leads notifications to
                </p>
                <p className="text-sm sm:text-base text-[var(--color-special)]">
                  {profileData?.email}
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex flex-col h-full">
            <div className="flex flex-1">
              <LeadStatsCard
                className="flex-1"
                locations={leadServicesData?.data?.locations || []}
                profile={profileData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
