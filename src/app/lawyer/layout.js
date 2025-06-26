'use client';

import React, { useEffect } from 'react';
import '@/styles/dashboard.css';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { LawyerSideNav } from '@/components/dashboard/lawyer/layout/SellerSideNav';
import SidebarTop from './dashboard/_component/common/SidebarTop';
import { usePathname, useRouter } from 'next/navigation';
import ScrollToTopOnRouteChange from './dashboard/_component/ScrollToTop';

export default function SellerDashboardLayout({ children }) {
  const pathname = usePathname();

  const cleanPathname = pathname?.trim().replace(/\/+$/, '');

  // Add all routes where scroll should be disabled
  const noScrollRoutes = [
    '/lawyer/dashboard/leads-board',
    '/lawyer/dashboard/my-responses',
  ];

  const isNoScrollPage = noScrollRoutes.includes(cleanPathname);

  useEffect(() => {
    if (isNoScrollPage) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isNoScrollPage]);

  return (
    <>
      <DashboardHeader />
      <SidebarProvider
        className="sidebar-main flex h-[calc(100vh-64px)]"
        style={{ minHeight: 'auto' }}
      >
        <Sidebar
          collapsible="icon"
          className="sidebar-width-control sidebar-y-64 h-full"
        >
          <SidebarHeader>
            <SidebarTop />
          </SidebarHeader>
          <SidebarContent>
            <LawyerSideNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 h-full bg-[#F3F3F3] overflow-y-auto">
          <div className="min-h-full flex flex-col p-5">
            <div className="flex-1">{children}</div>
          </div>
          {/* <DashboardFooter /> */}
        </div>
      </SidebarProvider>
    </>
  );
}
