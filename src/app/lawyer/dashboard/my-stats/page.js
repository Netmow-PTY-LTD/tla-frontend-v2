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
import CreditsStatsCard from '@/components/dashboard/lawyer/module/MyStats/CreditsStatsCard';
import { MapPin } from 'lucide-react';

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

        <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard
            profile={profileData}
            isLoading={isLoadingUserInfo}
            isError={isErrorUserInfo}
            error={errorUserInfo}
            className="flex-1"
          />

          <CreditsStatsCard />
          <Card className="flex-1 flex flex-col shadow-sm rounded-2xl">
            <div>
              <h2 className="font-medium flex items-center text-lg p-4">
                Lead Notifications
                <Link
                  href={'/lawyer/settings/notifications'}
                  aria-label="Edit Notification Email"
                  className="ml-3 rounded"
                >
                  <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
                </Link>
              </h2>
              <hr className="border-t border-[#D9D9D9]" />

              <div className="py-2 px-4">
                <p className="my-2 text-sm sm:text-base font-medium">
                  Sending new leads notifications to
                </p>
                <p className="text-sm sm:text-base text-[var(--color-special)]">
                  {profileData?.email}
                </p>
              </div>
            </div>

            <div className="mt-4 px-4">
              <hr className="border-t border-[#D9D9D9]" />

              <div className="font-medium flex items-center gap-2 text-lg mt-4">
                <h4 className="leading-none"> Locations</h4>
                <Link href={'/lawyer/settings/skill-settings'}>
                  <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
                </Link>
              </div>
              <p className="my-2 text-sm sm:text-base">
                {`You're receiving customers within`}
              </p>

              <div className="mt-[15px] space-y-3">
                {leadServicesData?.data?.locations?.map((location, index) => {
                  return (
                    <p
                      key={location._id || index}
                      className="text-[#0B1C2D] bg-[#F3F3F3] rounded-lg p-4 flex items-center"
                    >
                      <MapPin className="mr-2 w-4 h-4 text-gray-600" />
                      <span>{location?.locationGroupId?.zipcode}</span>
                    </p>
                  );
                })}
              </div>
            </div>
          </Card>

          <LeadStatsCard
            className="flex-1"
            locations={leadServicesData?.data?.locations || []}
            profile={profileData}
          />
        </div>

        <Card className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                About Description
              </h4>
              <Link
                href="/lawyer/settings/profile?section=about"
                aria-label="Edit About"
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <PencilIcon className="w-5 h-5" />
              </Link>
            </div>
            <div
              className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bio || fallbackBio }}
            ></div>
          </div>
        </Card>
        {/* <LeadSettings className="h-full " /> */}
      </div>
    </div>
  );
};

export default MyStatsPage;
