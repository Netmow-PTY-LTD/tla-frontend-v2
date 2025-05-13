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
      url: '/seller/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },

    {
      title: 'Leads',
      url: '/seller/dashboard/leads-board',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'My Responses',
      url: '/seller/dashboard/myresponses',
      icon: MessagesSquare,
      isActive: true,
    },
    {
      title: 'Settings',
      url: '/seller/settings',
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
      url: '/seller/dashboard/general-faqs',
      icon: CircleHelp,
      // isActive: true,
    },
    {
      title: 'Tutorials',
      url: '/seller/dashboard/tutorials',
      icon: BookText,
      // isActive: true,
    },
  ],
};
