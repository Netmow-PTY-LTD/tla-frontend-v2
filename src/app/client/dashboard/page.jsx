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
import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import ResponseSkeleton from '@/app/lawyer/dashboard/my-responses/_components/ResponseSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

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

  if (isLoadingUserInfo || isLoadingLeadServices) {
    return (
      <div className="p-6 space-y-8 animate-pulse max-w-[1100px] mx-auto">
        {/* Header section */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Content blocks */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Avatar skeleton */}
            <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
            {/* Text block */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="lg:m-4 w-full">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="font-bold heading border-b border-1 text-[#0B1C2D] pb-4">
          Dashboard
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
            <Card className="mt-5 flex-1 flex flex-col justify-between shadow-sm rounded-2xl">
              <div>
                <h2 className="font-medium flex items-center text-lg p-4">
                  Notifications
                </h2>
                <hr className="border-t border-[#D9D9D9]" />
                <div className="px-4">
                  <p className="my-3 text-sm sm:text-base font-medium">
                    Sending new notifications to
                  </p>
                  <p className="text-sm sm:text-base text-[var(--color-special)]">
                    {profileData?.email}
                  </p>
                </div>
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
