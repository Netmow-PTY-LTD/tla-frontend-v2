import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import React from 'react';
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

export default function BuyerDashboardLayout({ children }) {
  return (
    <>
      <BuyerDashboardHeader />
      <SidebarProvider>
        <Sidebar collapsible="icon" className="w-64">
          <SidebarHeader />
          <SidebarContent>
            <SideNav />
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
            <div className="flex-1 ">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
