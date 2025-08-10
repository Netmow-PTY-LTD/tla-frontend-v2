'use client';
import {
  LayoutDashboard,
  SquareKanban,
  MessagesSquare,
  CircleHelp,
  BookText,
  Settings,
  Users,
  BookOpenText,
} from 'lucide-react';

export const BuyerSidebarItems = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/client/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },

    {
      title: 'My Cases',
      url: '/client/dashboard/my-cases',
      icon: BookOpenText,
      isActive: true,
    },
    {
      title: 'Account Settings',
      url: '/client/account-settings/profile',
      icon: Settings,
      isActive: true,
    },
  ],
};
