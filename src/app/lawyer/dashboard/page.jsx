'use client';
import React from 'react';
import ProfileCard from './_component/home/ProfileCard';
import LeadSettingsCard from './_component/home/LeadSettingsCard';
import LeadsCountCard from './_component/home/LeadsCountCard';
import GetStartedCard from './_component/home/GetStartedCard';

import { useSelector } from 'react-redux';
import SendNewLeadsCard from './_component/home/SendNewLeadsCard';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useGetLeadServiceListQuery } from '@/store/features/leadService/leadServiceApiService';
import ResponseStatsCard from './_component/home/ResponseStatsCard';
import CreditsStatsCard from '@/components/dashboard/lawyer/module/MyStats/CreditsStatsCard';

export default function SellerDashboard() {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
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

  return (
    <div className=" max-w-[1100px] mx-auto relative z-0">
      {/* <WelcomeCard /> */}

      <ProfileCard />
      <div className="relative z-[1]">
        <div className="absolute inset-0 flex items-center justify-center z-[-1]">
          <div className="w-[200px] h-[200px] rounded-full bg-[#00C3C080] blur-[120px]"></div>
        </div>
        <div className="relative z-10">
          <GetStartedCard />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 relative z-[1]">
        <LeadSettingsCard
          services={profileData?.profile?.serviceIds || []}
          isLoading={isLoadingUserInfo || isLoadingLeadServices}
          isError={isErrorUserInfo || isErrorLeadServices}
          error={errorUserInfo || errorLeadServices}
          locations={locations}
        />
        <CreditsStatsCard />

        <LeadsCountCard />

        <SendNewLeadsCard
          isLoading={isLoadingUserInfo || isLoadingLeadServices}
          isError={isErrorUserInfo || isErrorLeadServices}
          error={errorUserInfo || errorLeadServices}
          locations={locations}
          profile={profileData}
        />
        <ResponseStatsCard />
      </div>
    </div>
  );
}
