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

export default async function SellerDashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <SidebarProvider>
        <Sidebar collapsible="icon" className="w-64">
          <SidebarHeader />
          <SidebarContent>
            <LawyerSideNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div
          className="w-full pb-10"
          style={{
            minHeight: 'calc(100vh - 74px - 42px)',
          }}
        >
          <div className="flex flex-col p-5 h-full">
            <div className="flex-1 rounded-xl bg-white  p-4 ">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
