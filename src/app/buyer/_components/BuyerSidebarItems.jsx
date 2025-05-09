'use client';
import {
  LayoutDashboard,
  SquareKanban,
  MessagesSquare,
  CircleHelp,
  BookText,
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
      title: 'Helps',
      url: '#',
      isActive: true,
    },
  ],
};
