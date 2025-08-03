'use client';
import {
  LayoutDashboard,
  SquareKanban,
  MessagesSquare,
  CircleHelp,
  BookText,
  Settings,
  Users,
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
      icon: Users,
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
      // url: '/lawyer/dashboard/general-faqs',
      url: '/faq',
      icon: CircleHelp,
      target: true,
      // isActive: true,
    },
    // {
    //   title: 'Tutorials',
    //   // url: '/lawyer/dashboard/tutorials',
    //   url: 'https://www.youtube.com',
    //   icon: BookText,
    //   target: true
    //   // isActive: true,
    // },
  ],
};
