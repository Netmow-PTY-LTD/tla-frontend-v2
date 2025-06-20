'use client';
import LeadSettingNotificationCard from '@/components/dashboard/lawyer/components/LeadSettingNotificationCard';
import LeadSettings from '@/components/dashboard/lawyer/components/LeadSettings';
import StatusCard from '@/components/dashboard/lawyer/components/StatusCard';
import ProfileCard from '@/components/dashboard/lawyer/module/MyStats/ProfileCard';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useGetLeadServiceListQuery } from '@/store/features/leadService/leadServiceApiService';

import React from 'react';

const MyStatsPage = () => {
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
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: leadServicesData,
    isLoading: isLoadingLeadServices,
    isError: isErrorLeadServices,
    error: errorLeadServices,
  } = useGetLeadServiceListQuery();

  const profileData = userInfo?.data ?? {};
  const locations = leadServicesData?.data?.locations ?? [];
  console.log('check profile data ==>', profileData);

  return (
    <div className="lg:m-4">
      <h2 className="font-bold heading border-b border-1 text-[#0B1C2D] pb-4">
        Overview of Your Stats
      </h2>

      <div className="mt-5 grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5 mb-10">
        {/* Left Section - Profile */}
        <div className="h-full ">
          <ProfileCard
            profile={profileData}
            isLoading={isLoadingUserInfo}
            isError={isErrorUserInfo}
            error={errorUserInfo}
            className="h-full"
          />
        </div>

        {/* Middle Section - Status + Lead Settings */}
        <div className="grid grid-rows-[auto_1fr] gap-5 h-full">
          <div className="lg:flex space-y-4 lg:space-y-0 lg:gap-5">
            <StatusCard
              status="pending"
              count={24}
              menuItems={menuLinks}
              className="flex-1 h-full"
            />
            <StatusCard
              status="hired"
              count={24}
              menuItems={menuLinks}
              className="flex-1 h-full"
            />
          </div>
          <LeadSettingNotificationCard
            services={profileData?.profile?.serviceIds || []}
            isLoading={isLoadingUserInfo || isLoadingLeadServices}
            isError={isErrorUserInfo || isErrorLeadServices}
            error={errorUserInfo || errorLeadServices}
            locations={locations}
            className="h-full"
          />
        </div>

        {/* Right Section - Messages + Lead Settings */}
        <div className="grid grid-rows-2 gap-5 h-full ">
          {/* <MessageCard messages={messagesData} /> */}
          <LeadSettings className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default MyStatsPage;
