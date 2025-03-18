'use client';
import {
  Settings2,
  SquareTerminal,
  Plus,
  LayoutDashboard,
  List,
  BriefcaseBusiness,
} from 'lucide-react';

export const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard/super-admin',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Services',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Add Service',
          url: '/dashboard/super-admin/services/add-service',
          icon: Plus,
        },
        {
          title: 'List Of Services',
          url: '/dashboard/super-admin/services/list-of-services',
          icon: List,
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
          icon: BriefcaseBusiness,
        },
      ],
    },
  ],
};
