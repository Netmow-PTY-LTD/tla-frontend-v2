// 'use client';
// import LeadSettingNotificationCard from '@/components/dashboard/lawyer/components/LeadSettingNotificationCard';
// import LeadSettings from '@/components/dashboard/lawyer/components/LeadSettings';
// import StatusCard from '@/components/dashboard/lawyer/components/StatusCard';
// import ProfileCard from '@/components/dashboard/lawyer/module/MyStats/ProfileCard';
// import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
// import { useGetLeadServiceListQuery } from '@/store/features/leadService/leadServiceApiService';

// import React from 'react';

// const MyStatsPage = () => {
//   const menuLinks = [
//     { label: 'All Time', href: '#/all-time' },
//     { label: 'Today', href: '#/today' },
//     { label: 'This Week', href: '#/this-week' },
//     { label: 'This Month', href: '#/this-month' },
//   ];

//   const {
//     data: userInfo,
//     isLoading: isLoadingUserInfo,
//     isError: isErrorUserInfo,
//     error: errorUserInfo,
//   } = useAuthUserInfoQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//   });

//   const {
//     data: leadServicesData,
//     isLoading: isLoadingLeadServices,
//     isError: isErrorLeadServices,
//     error: errorLeadServices,
//   } = useGetLeadServiceListQuery();

//   const profileData = userInfo?.data ?? {};
//   const locations = leadServicesData?.data?.locations ?? [];
//   console.log('check profile data ==>', profileData);

//   return (
//     <div className="lg:m-4">
//       <h2 className="font-bold heading border-b border-1 text-[#0B1C2D] pb-4">
//         Overview of Your Stats
//       </h2>

//       <div className="mt-5 grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5 mb-10">
//         {/* Left Section - Profile */}
//         <div className="h-full ">
//           <ProfileCard
//             profile={profileData}
//             isLoading={isLoadingUserInfo}
//             isError={isErrorUserInfo}
//             error={errorUserInfo}
//             className="h-full"
//           />
//         </div>

//         {/* Middle Section - Status + Lead Settings */}
//         <div className="grid grid-rows-[auto_1fr] gap-5 h-full">
//           <div className="lg:flex space-y-4 lg:space-y-0 lg:gap-5">
//             <StatusCard
//               status="pending"
//               count={24}
//               menuItems={menuLinks}
//               className="flex-1 h-full"
//             />
//             <StatusCard
//               status="hired"
//               count={24}
//               menuItems={menuLinks}
//               className="flex-1 h-full"
//             />
//           </div>
//           <LeadSettingNotificationCard
//             services={profileData?.profile?.serviceIds || []}
//             isLoading={isLoadingUserInfo || isLoadingLeadServices}
//             isError={isErrorUserInfo || isErrorLeadServices}
//             error={errorUserInfo || errorLeadServices}
//             locations={locations}
//             className="h-full"
//           />
//         </div>

//         {/* Right Section - Messages + Lead Settings */}
//         <div className="grid grid-rows-2 gap-5 h-full ">
//           {/* <MessageCard messages={messagesData} /> */}
//           <LeadSettings className="h-full" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyStatsPage;

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
                <h1 className="font-medium flex items-center text-lg">
                  Lead Notifications
                  <button
                    aria-label="Edit Notification Email"
                    className="ml-3 rounded"
                  >
                    <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
                  </button>
                </h1>
                <p className="my-2 text-sm sm:text-base">
                  Sending new leads notifications to
                </p>
                <p className="text-sm sm:text-base">yourmail@example.com</p>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex flex-col h-full">
            <div className="flex flex-1">
              <LeadStatsCard
                status="pending"
                count={24}
                menuItems={menuLinks}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                About Description
              </h4>
              <Link
                href="/lawyer/settings/profile"
                aria-label="Edit About"
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <PencilIcon className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed">
              {bio || fallbackBio}
            </div>
          </div>
        </Card>
        <LeadSettings className="h-full " />
      </div>
    </div>
  );
};

export default MyStatsPage;
