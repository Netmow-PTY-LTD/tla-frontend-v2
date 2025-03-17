import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import React from 'react';
import '@/styles/dashboard.css';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SideNav } from '@/components/dashboard/lawyer/SideNav';

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <SidebarProvider>
        <Sidebar collapsible="icon" className="w-64">
          <SidebarHeader />
          <SidebarContent>
            <SideNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div
          className="w-full "
          style={{
            minHeight: 'calc(100vh - 74px)',
          }}
        >
          <div className="flex flex-col p-5 h-full">
            <div className="flex-1">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
