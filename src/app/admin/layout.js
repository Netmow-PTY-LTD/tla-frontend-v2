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
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const cleanPathname = pathname?.trim().replace(/\/+$/, '');

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
      document.body.style.overflow = 'hidden'; // ✅ allow internal scroll
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isNoScrollPage]);

  return (
    <>
      <AdminDashboardHeader />
      <SidebarProvider
        className="sidebar-main h-[calc(100vh-64px)]"
        style={{ minHeight: 'auto' }}
      >
        <Sidebar
          collapsible="icon"
          className="sidebar-width-control sidebar-y-64 h-[calc(100vh-64px)]"
        >
          <SidebarHeader>
            <SidebarTop />
          </SidebarHeader>
          <SidebarContent>
            <SideNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        {/* ✅ This is the only scrollable area */}
        <div
          className={`flex-1 dashboard-content ${
            isNoScrollPage ? 'no-scroll' : ''
          }`}
        >
          <div className="flex flex-col">
            <div className="flex-1 p-5">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
