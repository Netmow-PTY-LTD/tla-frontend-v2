import React from 'react';

import { Bell, UserIcon } from 'lucide-react';
import SettingsTabs from '@/components/dashboard/Settings/SettingTab';

const SettingsLayout = ({ children }) => {
  const tabs = [
    {
      label: 'Profile',
      href: '/client/account-settings/profile',
      icon: <UserIcon className="w-4 h-4" />,
    },
    // {
    //   label: 'Notification',
    //   href: '/client/account-settings/notification',
    //   icon: <Bell className="w-4 h-4" />,
    // },
  ];

  return (
    <div className="">
      {/* <SettingsTabs tabs={tabs} /> */}
      <div className="px-4 ">{children}</div>
    </div>
  );
};

export default SettingsLayout;
