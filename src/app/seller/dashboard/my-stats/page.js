import LeadSettingNotificationCard from '@/components/dashboard/lawyer-dashboard/components/LeadSettingNotificationCard';
import LeadSettings from '@/components/dashboard/lawyer-dashboard/components/LeadSettings';
import MessageCard from '@/components/dashboard/lawyer-dashboard/components/MessageCard';
import StatusCard from '@/components/dashboard/lawyer-dashboard/components/StatusCard';
import ProfileCard from '@/components/dashboard/lawyer-dashboard/module/MyStats/ProfileCard';

import React from 'react';

const MyStatsPage = () => {
  const menuLinks = [
    { label: 'All Time', href: '#/all-time' },
    { label: 'Today', href: '#/today' },
    { label: 'This Week', href: '#/this-week' },
    { label: 'This Month', href: '#/this-month' },
  ];

  const messagesData = [
    {
      id: 1,
      name: 'Jerome Bell',
      message: 'Maplewood Ave, Sunnyvale, California 94086',
      time: '11:43 AM',
      avatar: '/assets/img/auth-step1.png',
    },
    {
      id: 2,
      name: 'Jane Cooper',
      message: '  Maplewood Ave, Sunnyvale, California 94086',
      time: '10:30 AM',
      avatar: '/assets/img/auth-step1.png',
    },
    {
      id: 3,
      name: 'Cody Fisher',
      message: '  Maplewood Ave, Sunnyvale, California 94086',
      time: '9:15 AM',
      avatar: '/assets/img/auth-step1.png',
    },
    {
      id: 4,
      name: 'Cody Fisher',
      message: '  Maplewood Ave, Sunnyvale, California 94086',
      time: '9:15 AM',
      avatar: '/assets/img/auth-step1.png',
    },
  ];

  return (
    <div className="lg:m-5">
      <h1 className="font-bold text-2xl border-b-2 text-[#0B1C2D] ">
        Overview of Your Stats
      </h1>

      <div className="mt-5 grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5 mb-10">
        {/* Left Section - Profile */}
        <div className="h-full ">
          <ProfileCard className="h-full" />
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
          <LeadSettingNotificationCard className="h-full" />
        </div>

        {/* Right Section - Messages + Lead Settings */}
        <div className="grid grid-rows-2 gap-5 h-full ">
          <MessageCard messages={messagesData} />
          <LeadSettings className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default MyStatsPage;
