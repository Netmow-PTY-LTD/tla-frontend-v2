'use client';
import {
  LayoutDashboard,
  SquareKanban,
  MessagesSquare,
  CircleHelp,
  BookText,
} from 'lucide-react';

export const lawyerDashboardSidebar = {
  navMain: [
    // {
    //   title: 'Dashboard',
    //   url: '/dashboard/lawyer',
    //   icon: LayoutDashboard,
    //   isActive: true,
    // },

    {
      title: 'Lead Boards',
      url: '/dashboard/lawyer/lead-board',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'My Stats',
      url: '/dashboard/lawyer/my-stats',
      icon: SquareKanban,
      isActive: true,
    },
    {
      title: 'Response',
      url: '/dashboard/lawyer/my-response',
      icon: MessagesSquare,
      isActive: true,
    },
    {
      title: 'Helps',
      url: '#',
      isActive: true,
    },

    {
      title: 'General FAQ’s',
      url: '#',
      icon: CircleHelp,
      // isActive: true,
    },
    {
      title: 'Tutorials',
      url: '#',
      icon: BookText,
      // isActive: true,
    },
  ],
};
