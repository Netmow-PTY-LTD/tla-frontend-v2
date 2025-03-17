import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import React from 'react';
import '@/styles/dashboard.css';
import { SideNav } from '@/components/dashboard/lawyer/SideNav';

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <div className="flex">
        <div className="sidebar-wrapper">
          <SideNav />
        </div>
        <main className="main-content">
          {children}
          <DashboardFooter />
        </main>
      </div>
    </>
  );
}
