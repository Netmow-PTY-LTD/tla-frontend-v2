'use client';

import React, { useEffect, useState } from 'react';
import '@/styles/dashboard.css';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/lawyer/layout/SellerSideNav';

export default function SellerDashboardLayout({ children }) {
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const pathname = usePathname();

  const cleanPathname = pathname?.trim().replace(/\/+$/, '');

  // Add all routes where scroll should be disabled
  const noScrollRoutes = [
    '/lawyer/dashboard/cases',
    '/lawyer/dashboard/my-responses',
  ];

  const isNoScrollPage = noScrollRoutes.includes(cleanPathname);

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
      <DashboardHeader onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`flex-1 bg-[#f3f3f3] dashboard-content ${
            isNoScrollPage ? 'no-scroll' : ''
          }`}
        >
          <div className="flex flex-col p-5">
            <div className="flex-1">{children}</div>
          </div>
          {/* <DashboardFooter /> */}
        </div>
      </div>
    </>
  );
}
