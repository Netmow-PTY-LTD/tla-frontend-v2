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
      url: '/buyer/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },

    {
      title: 'My Requests',
      url: '/buyer/dashboard/my-requests',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Account Settings',
      url: '/buyer/account-settings',
      icon: Settings,
      isActive: true,
    },
  ],
};
