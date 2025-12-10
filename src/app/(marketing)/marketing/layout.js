'use client';

import '@/styles/dashboard.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import MarketingDashboardHeader from './_components/dashboard/MarketingDashboardHeader';
import MarketingSideNav from './_components/dashboard/MarketingSideNav';


export default function AdminDashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const pathname = usePathname();
  const cleanPathname = pathname?.trim().replace(/\/+$/, '');

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
      document.body.style.overflow = 'hidden'; // ✅ allow internal scroll
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isNoScrollPage]);

  return (
    <>
      <MarketingDashboardHeader onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <MarketingSideNav
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div
          className={`flex-1 dashboard-content ${isNoScrollPage ? 'no-scroll' : ''
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 py-4 px-5">{children}</div>
            <DashboardFooter />
          </div>
        </div>
      </div>


    </>
  );
}


