'use client';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import React, { useEffect } from 'react';
import '@/styles/dashboard.css';
import { SideNav } from '@/components/dashboard/common/SideNav';
import BuyerDashboardHeader from './_components/BuyerDashboardHeader';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import SidebarTop from '../lawyer/dashboard/_component/common/SidebarTop';
import { ClientSideNav } from './_components/ClientSideNav';
import { usePathname } from 'next/navigation';

export default function BuyerDashboardLayout({ children }) {
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
      <BuyerDashboardHeader />
      <SidebarProvider
        className="sidebar-main h-[calc(100vh-64px)]"
        style={{ minHeight: 'auto' }}
      >
        <Sidebar
          collapsible="icon"
          className="sidebar-width-control sidebar-y-64"
        >
          <SidebarHeader>
            <SidebarTop />
          </SidebarHeader>
          <SidebarContent>
            <ClientSideNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div
          className={`flex-1 bg-[#F3F3F3] dashboard-content ${
            isNoScrollPage ? 'no-scroll' : ''
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
