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
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings,
      isActive: true,
    },
    {
      title: 'Countries',
      url: '/admin/country/list',
      icon: MapPinHouse,
      isActive: true,
    },
    {
      title: 'Zip Codes',
      url: '/admin/zip-code/list',
      icon: MapPinHouse,
      isActive: true,
    },
    {
      title: 'Ranges',
      url: '/admin/ranges/list',
      icon: MapPinHouse,
      isActive: true,
    },
    {
      title: 'Services',
      url: '/admin/service/list',
      icon: SquareTerminal,
      isActive: true,
    },
    // {
    //   title: 'Country',
    //   url: '/admin/country/list',
    //   icon: MapPinHouse,
    //   isActive: true,
    //   items: [
    //     // {
    //     //   title: 'Add Country',
    //     //   url: '/admin/country/add',
    //     //   icon: Plus,
    //     //   isActive: true,
    //     // },
    //     // {
    //     //   title: 'List of Countries',
    //     //   url: '/admin/country/list',
    //     //   icon: List,
    //     //   isActive: true,
    //     // },
    //   ],
    // },
    // {
    //   title: 'Zip Code',
    //   url: '#',
    //   icon: MapPinHouse,
    //   isActive: true,
    //   items: [
    //     // {
    //     //   title: 'Add Zip Code',
    //     //   url: '/admin/zip-code/add',
    //     //   icon: Plus,
    //     //   isActive: true,
    //     // },
    //     {
    //       title: 'List of Zip Code',
    //       url: '/admin/zip-code/list',
    //       icon: List,
    //       isActive: true,
    //     },
    //   ],
    // },

    // {
    //   title: 'Services',
    //   url: '#',
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     // {
    //     //   title: 'Add Service',
    //     //   url: '/admin/service/add',
    //     //   icon: Plus,
    //     //   isActive: true,
    //     // },
    //     {
    //       title: 'List of Service',
    //       url: '/admin/service/list',
    //       icon: List,
    //       isActive: true,
    //     },
    //   ],
    // },
    {
      title: 'Country Wise Services',
      url: '/admin/country-wise-service/list',
      icon: List,
      isActive: true,
    },
    {
      title: 'Manage Services',
      url: '/admin/manage-services',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Service Wise Questions',
      url: '/admin/question/add',
      icon: SquareTerminal,
      isActive: true,
    },

    {
      title: 'Question Wise Options',
      url: '/admin/option/add',
      icon: SquareTerminal,
      isActive: true,
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
      title: 'Credit Packages',
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
  ],
};
