

'use client';
import {
  Users,
  FileText,
  File,
  MapPin,
  Clipboard,
  CreditCard,
  BarChart2,
  ListChecks,
  Briefcase,
  Newspaper,
  List,
  Logs,
} from 'lucide-react';

export const MarketingSidebarItems = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/marketing',
      icon: BarChart2,
      isActive: true,
    },
    {
      title: 'Lawyers',
      url: '/marketing/lawyers',
      icon: Users,
      isActive: true,
      items: [
        { title: 'Add Lawyer', url: '/marketing/lawyers/create', isActive: true },
        { title: 'All Lawyers', url: '/marketing/lawyers', isActive: true },
      ],
    },

     {
      title: 'Blog',
      url: '#',
      icon: Newspaper,
      isActive: true,
      items: [
        {
          title: 'List of Blog Category',
          url: '/marketing/blog-category/list',
          icon: List,
          isActive: true,
        },
        {
          title: 'List of Blogs',
          url: '/marketing/blog/list',
          icon: List,
          isActive: true,
        },
        {
          title: 'Add New Blog',
          url: '/marketing/blog/add',
          icon: Logs,
          isActive: true,
        },
      ],
    },

     {
      title: 'SEO',
      url: '#',
      icon: List,
      isActive: true,
      items: [
        {
          title: 'SEO Pages',
          url: '/marketing/seo/pages',
          icon: List,
          isActive: true,
        },
        
      ],
    },
    // {
    //   title: 'Services',
    //   url: '/marketing/services/list',
    //   icon: Briefcase,
    //   isActive: true,
    //   items: [
    //     { title: 'Add Service', url: '/marketing/services/create', isActive: true },
    //     { title: 'Service List', url: '/marketing/services/list', isActive: true },
    //   ],
    // },
    // {
    //   title: 'Leads',
    //   url: '/marketing/leads/list',
    //   icon: Clipboard,
    //   isActive: true,
    //   items: [
    //     { title: 'Add Lead', url: '/marketing/leads/create', isActive: true },
    //     { title: 'All Leads', url: '/marketing/leads/list', isActive: true },
    //     { title: 'Incomplete Leads', url: '/marketing/leads/incomplete', isActive: true },
    //   ],
    // },
    // {
    //   title: 'Locations',
    //   url: '/marketing/locations/country',
    //   icon: MapPin,
    //   isActive: true,
    //   items: [
    //     { title: 'Country', url: '/marketing/locations/country', isActive: true },
    //     { title: 'State', url: '/marketing/locations/state', isActive: true },
    //     { title: 'City', url: '/marketing/locations/city', isActive: true },
    //     { title: 'ZIP', url: '/marketing/locations/zip', isActive: true },
    //   ],
    // },
    // {
    //   title: 'Invoices',
    //   url: '/marketing/invoices/list',
    //   icon: CreditCard,
    //   isActive: true,
    //   items: [
    //     { title: 'Add Invoice', url: '/data-entry/invoices/create', isActive: true },
    //     { title: 'Pending Invoices', url: '/data-entry/invoices/pending', isActive: true },
    //   ],
    // },
    // {
    //   title: 'Documents',
    //   url: '/data-entry/documents/upload',
    //   icon: File,
    //   isActive: true,
    //   items: [
    //     { title: 'Upload', url: '/data-entry/documents/upload', isActive: true },
    //     { title: 'Bulk Upload', url: '/data-entry/documents/bulk-upload', isActive: true },
    //   ],
    // },
    // {
    //   title: 'Reports',
    //   url: '/data-entry/reports/daily',
    //   icon: ListChecks,
    //   isActive: true,
    //   items: [
    //     { title: 'Daily', url: '/data-entry/reports/daily', isActive: true },
    //     { title: 'Accuracy', url: '/data-entry/reports/accuracy', isActive: true },
    //     { title: 'Performance', url: '/data-entry/reports/performance', isActive: true },
    //   ],
    // },
  ],
};
