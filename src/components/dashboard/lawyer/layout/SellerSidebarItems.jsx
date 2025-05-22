'use client';
import {
  LayoutDashboard,
  SquareKanban,
  MessagesSquare,
  CircleHelp,
  BookText,
  Settings,
} from 'lucide-react';

export const SellerSidebarItems = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/lawyer/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },

    {
      title: 'Leads',
      url: '/lawyer/dashboard/leads-board',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'My Responses',
      url: '/lawyer/dashboard/my-responses',
      icon: MessagesSquare,
      isActive: true,
    },
    {
      title: 'Settings',
      url: '/lawyer/settings/profile',
      icon: Settings,
      isActive: true,
    },
    {
      title: 'Helps',
      url: '#',
      isActive: true,
    },

    {
      title: 'General FAQ’s',
      url: '/lawyer/dashboard/general-faqs',
      icon: CircleHelp,
      // isActive: true,
    },
    {
      title: 'Tutorials',
      url: '/lawyer/dashboard/tutorials',
      icon: BookText,
      // isActive: true,
    },
  ],
};
