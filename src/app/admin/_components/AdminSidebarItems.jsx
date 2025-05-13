'use client';
import {
  LayoutDashboard,
  SquareKanban,
  MessagesSquare,
  CircleHelp,
  BookText,
  Settings,
} from 'lucide-react';

export const AdminSidebarItems = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Settings',
      url: '/seller/settings',
      icon: Settings,
      isActive: true,
    },
  ],
};
