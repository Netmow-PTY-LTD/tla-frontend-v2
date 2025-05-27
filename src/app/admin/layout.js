'use client';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import AdminDashboardHeader from './_components/AdminDashboardHeader';
import '@/styles/dashboard.css';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SideNav } from '@/components/dashboard/common/SideNav';
import SidebarTop from '../lawyer/dashboard/_component/common/SidebarTop';

export default function AdminDashboardLayout({ children }) {
  return (
    <>
      <AdminDashboardHeader />
      <SidebarProvider className="sidebar-main">
        <Sidebar collapsible="icon" className="sidebar-width-control">
          <SidebarHeader>
            <SidebarTop />
          </SidebarHeader>
          <SidebarContent>
            <SideNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div
          className="flex-1 dashboard-content"
          style={{
            minHeight: 'calc(100vh - 74px - 42px)',
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 p-5">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
