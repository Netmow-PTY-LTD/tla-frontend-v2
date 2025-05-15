'use client';
import {
  LayoutDashboard,
  List,
  MapPinHouse,
  Plus,
  Settings,
  SquareTerminal,
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
      title: 'Country',
      url: '#',
      icon: MapPinHouse,
      isActive: true,
      items: [
        {
          title: 'Add Country',
          url: '/admin/country/add',
          icon: Plus,
          isActive: true,
        },
        {
          title: 'List of Countries',
          url: '/admin/country/list',
          icon: List,
          isActive: true,
        },
      ],
    },
    {
      title: 'Options',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Add Option',
          url: '/admin/option/add',
          icon: Plus,
          isActive: true,
        },
        {
          title: 'List of Options',
          url: '/admin/option/list',
          icon: List,
          isActive: true,
        },
      ],
    },
    {
      title: 'Services',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Add Service',
          url: '/admin/service/add',
          icon: Plus,
          isActive: true,
        },
        {
          title: 'List of Service',
          url: '/admin/service/list',
          icon: List,
          isActive: true,
        },
      ],
    },

    {
      title: 'Subscriptions',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Add Subscription',
          url: '/admin/subscription/add',
          icon: Plus,
          isActive: true,
        },
        {
          title: 'List of Subscriptions',
          url: '/admin/subscription/list',
          icon: List,
          isActive: true,
        },
      ],
    },
    {
      title: 'Packages',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Add Package',
          url: '/admin/package/add',
          icon: Plus,
          isActive: true,
        },
        {
          title: 'List of Packages',
          url: '/admin/package/list',
          icon: List,
          isActive: true,
        },
      ],
    },

    {
      title: 'Users',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'List of Users',
          url: '/admin/user/list',
          icon: List,
          isActive: true,
        },
      ],
    },
    {
      title: 'Account Settings',
      url: '/admin/account-settings',
      icon: Settings,
      isActive: true,
    },
  ],
};
