'use client';
import {
  LayoutDashboard,
  SquareKanban,
  MessagesSquare,
  CircleHelp,
  BookText,
  Settings,
} from 'lucide-react';

export const BuyerSidebarItems = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/client/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },

    // {
    //   title: 'My Leads',
    //   url: '/client/dashboard/my-leads',
    //   icon: LayoutDashboard,
    //   isActive: true,
    // },
    {
      title: 'Account Settings',
      url: '/client/account-settings/profile',
      icon: Settings,
      isActive: true,
    },
  ],
};
