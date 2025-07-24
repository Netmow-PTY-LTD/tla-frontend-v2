'use client';
import {
  ChartBarStacked,
  ChartColumnStacked,
  CircleEllipsis,
  Earth,
  FileQuestionMark,
  LandPlot,
  LayoutDashboard,
  List,
  MapPinHouse,
  Package,
  Plus,
  Podcast,
  Settings,
  SquareKanban,
  SquareTerminal,
  Users,
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
      icon: Earth,
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
      icon: LandPlot,
      isActive: true,
    },
    {
      title: 'Categories',
      url: '/admin/category/list',
      icon: ChartColumnStacked,
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
      title: 'Category Wise Services',
      url: '/admin/category-wise-service',
      icon: ChartBarStacked,
      isActive: true,
    },
    {
      title: 'Country Wise Services',
      url: '/admin/country-wise-service/list',
      icon: List,
      isActive: true,
    },

    {
      title: 'Manage Services',
      url: '/admin/manage-services',
      icon: SquareKanban,
      isActive: true,
    },
    {
      title: 'Service Wise Questions',
      url: '/admin/question/add',
      icon: FileQuestionMark,
      isActive: true,
    },

    {
      title: 'Question Wise Options',
      url: '/admin/option/add',
      icon: CircleEllipsis,
      isActive: true,
    },
    {
      title: 'Subscriptions',
      url: '#',
      icon: Podcast,
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
      icon: Package,
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
      icon: Users,
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
      title: 'Lead Management',
      url: '/admin/leads-management',
      icon: Users,
      isActive: true,
      // items: [
      //   {
      //     title: 'List of Users',
      //     url: '/admin/leads-management',
      //     icon: List,
      //     isActive: true,
      //   },
      // ],
    },
  ],
};
