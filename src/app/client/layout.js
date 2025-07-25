'use client';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import React, { useEffect, useState } from 'react';
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
import { usePathname } from 'next/navigation';
import ClientSideNav from './_components/ClientSideNav';

export default function BuyerDashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const pathname = usePathname();

  const cleanPathname = pathname?.trim().replace(/\/+$/, '');

  // Add all routes where scroll should be disabled
  const noScrollRoutes = [
    '/lawyer/dashboard/leads-board',
    '/lawyer/dashboard/my-responses',
    '/client/dashboard/my-leads',
  ];

  const noScrollRoutePatterns = [
    /^\/client\/dashboard\/my-leads\/[a-zA-Z0-9]+$/, // Matches /client/dashboard/my-leads/:id
  ];

  const isNoScrollPage =
    noScrollRoutes.includes(cleanPathname) ||
    noScrollRoutePatterns.some((pattern) => pattern.test(cleanPathname));

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
      <BuyerDashboardHeader onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <ClientSideNav
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div
          className={`flex-1 bg-[#f3f3f3] dashboard-content ${
            isNoScrollPage ? 'no-scroll' : ''
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 py-4 px-5">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </div>
    </>
  );
}
