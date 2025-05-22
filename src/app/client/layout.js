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

export default function BuyerDashboardLayout({ children }) {
  return (
    <>
      <BuyerDashboardHeader />
      <SidebarProvider className="sidebar-main">
        <Sidebar collapsible="icon" className="w-96">
          <SidebarHeader>
            <SidebarTop />
          </SidebarHeader>
          <SidebarContent>
            <SideNav />
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
            <div className="flex-1 py-5 px-4">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
