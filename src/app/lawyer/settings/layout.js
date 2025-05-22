import React from 'react';

import {
  UserIcon,
  BarChart3Icon,
  UsersIcon,
  MessageCircleIcon,
  SettingsIcon,
  CreditCardIcon,
} from 'lucide-react';
import SettingsTabs from '@/components/dashboard/Settings/SettingTab';
const SettingsLayout = ({ children }) => {
  const tabs = [
    {
      label: 'Profile',
      href: '/lawyer/settings/profile',
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      label: 'Lead Settings',
      href: '/lawyer/settings/lead-settings/my-services',
      icon: <BarChart3Icon className="w-4 h-4" />,
    },
    {
      label: 'Enquiries',
      href: '/lawyer/settings/enquiries/enquiries-settings',
      icon: <UsersIcon className="w-4 h-4" />,
      badge: 'BETA',
    },
    {
      label: 'Communication',
      href: '/lawyer/settings/communication/one-click-response',
      icon: <MessageCircleIcon className="w-4 h-4" />,
    },

    {
      label: 'Integration',
      href: '/lawyer/settings/integrations/hubspot',
      icon: <SettingsIcon className="w-4 h-4" />,
    },
    {
      label: 'Credits & Payments',
      href: '/lawyer/settings/billing/my-credits',
      icon: <CreditCardIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className=" border rounded-xl">
      <SettingsTabs tabs={tabs} />
      <div className="p-4 bg-white w-full">{children}</div>
    </div>
  );
};

export default SettingsLayout;
