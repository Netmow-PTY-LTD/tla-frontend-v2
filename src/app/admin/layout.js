'use client';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import AdminDashboardHeader from './_components/AdminDashboardHeader';
import '@/styles/dashboard.css';
import AdminSidebar, { SideNav } from '@/components/dashboard/common/SideNav';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


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
      <AdminDashboardHeader onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div
          className={`flex-1 dashboard-content ${
            isNoScrollPage ? 'no-scroll' : ''
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


