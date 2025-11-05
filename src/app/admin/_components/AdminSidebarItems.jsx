'use client';
import {
  ArrowLeftRight,
  ChartBarStacked,
  ChartColumnStacked,
  CircleEllipsis,
  Earth,
  FileKey2,
  FileQuestionMark,
  CircleAlert,
  Kanban,
  LandPlot,
  LayoutDashboard,
  List,
  Logs,
  MapPinHouse,
  Package,
  Plus,
  Podcast,
  Settings,
  SquareKanban,
  SquareTerminal,
  Users,
  Building2,
  BookImage,
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
      title: 'Cities',
      url: '/admin/cities',
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
      title: 'License Management',
      url: '/admin/license-management',
      icon: FileKey2,
      isActive: true,
    },
    {
      title: 'Subscriptions',
      url: '/admin/subscriptions',
      icon: Podcast,
      isActive: true,
    },
    {
      title: 'Elite Pro Subscriptions',
      url: '/admin/elite-pro',
      icon: List,
      isActive: true,
    },
    {
      title: 'Pages',
      url: '/admin/page/list',
      icon: List,
      isActive: true,
    },
    {
      title: 'Gallery',
      url: '/admin/gallery',
      icon: BookImage,
      isActive: true,
    },

    {
      title: 'Credit Packages',
      url: '/admin/package/add',
      icon: Package,
      isActive: true,
    },
    {
      title: 'Transaction Management',
      url: '/admin/transection-management',
      icon: ArrowLeftRight, // Set size if needed
      isActive: true,
    },
    {
      title: 'Claim Account Requests',
      url: '/admin/claim-account-requests',
      icon: CircleAlert,
      isActive: true,
    },
    {
      title: 'Firms List',
      url: '/admin/firm/list',
      icon: Building2,
      isActive: true,
    },
    {
      title: 'Users',
      url: '#',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'List of Lawyers',
          url: '/admin/user/lawyer-list',
          icon: List,
          isActive: true,
        },
        {
          title: 'List of Clients',
          url: '/admin/user/client-list',
          icon: Logs,
          isActive: true,
        },
        {
          title: 'List of Client Details',
          url: '/admin/list-client-details',
          icon: List,
          isActive: true,
        },
        {
          title: 'List of Lawyer Details',
          url: '/admin/list-lawyer-details',
          icon: List,
          isActive: true,
        },
      ],
    },
    {
      title: 'Case Management',
      url: '/admin/cases-management',
      icon: Kanban,
      isActive: true,
      // items: [
      //   {
      //     title: 'List of Users',
      //     url: '/admin/cases-management',
      //     icon: List,
      //     isActive: true,
      //   },
      // ],
    },
    {
      title: 'Testimonials',
      url: '/admin/testimonials',
      icon: Kanban,
      isActive: true,
    },
  ],
};
