import React from 'react';
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

export default async function SellerDashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <SidebarProvider className="sidebar-main">
        <Sidebar collapsible="icon" className="w-96">
          <SidebarHeader>
            <SidebarTop />
          </SidebarHeader>

          <SidebarContent>
            <LawyerSideNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div
          className="flex-1 main-content"
          style={{
            minHeight: 'calc(100vh - 74px - 42px)',
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1  bg-[#F3F3F3] p-5 w-full">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
