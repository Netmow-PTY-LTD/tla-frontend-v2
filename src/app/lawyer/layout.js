'use client';

import React, { use, useEffect, useState } from 'react';
import '@/styles/dashboard.css';
import DashboardHeader from '@/components/dashboard/common/DashboardHeader';
import DashboardFooter from '@/components/dashboard/common/DashboardFooter';
import { LawyerSideNav } from '@/components/dashboard/lawyer/layout/SellerSideNav';
import SidebarTop from './dashboard/_component/common/SidebarTop';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/lawyer/layout/SellerSideNav';
import { io, Socket } from 'socket.io-client';

export default function SellerDashboardLayout({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const pathname = usePathname();

  const cleanPathname = pathname?.trim().replace(/\/+$/, '');

  // Add all routes where scroll should be disabled
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isNoScrollPage]);

  //socket.io

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  //console.log('connected', connected);

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
