'use client';
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
import SidebarTop from '../lawyer/dashboard/_component/common/SidebarTop';
import { ClientSideNav } from './_components/ClientSideNav';

export default function BuyerDashboardLayout({ children }) {
  return (
    <>
      <BuyerDashboardHeader />
      <SidebarProvider className="sidebar-main">
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
          className="flex-1 dashboard-content"
          style={{
            minHeight: 'calc(100vh - 74px - 42px)',
          }}
        >
          <div className="flex flex-col h-[calc(100vh-70px)] ">
            <div className="flex-1 p-4 bg-[#F3F3F3]">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
