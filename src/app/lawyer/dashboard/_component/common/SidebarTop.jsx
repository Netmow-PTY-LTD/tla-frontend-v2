'use client';

import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SidebarTop() {
  const [greeting, setGreeting] = useState('');
  const [dateTime, setDateTime] = useState('');

  const { data: userInfo } = useAuthUserInfoQuery();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Greeting logic
      if (hour < 12) {
        setGreeting('Good Morning');
      } else if (hour === 12 && minute < 60) {
        setGreeting('Good Noon');
      } else if (hour < 17) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }

      // Format date and time
      const formatted = now.toLocaleString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      // Make only AM/PM uppercase
      const formattedWithUppercaseMeridiem = formatted.replace(
        /\b(am|pm)\b/i,
        (match) => match.toUpperCase()
      );
      setDateTime(formattedWithUppercaseMeridiem.replace(',', ''));
    };

    updateDateTime(); // initial
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="sidebar-top"
      // style={{ backgroundImage: `url(/assets/img/bg-shape.png)` }}
    >
      <span className="date">{dateTime}</span>
      <h2>
        {greeting},{' '}
        <span className="highlight">
          {userInfo?.data?.profile?.name.split(' ')[0] ?? 'Lawyer'}!{' '}
        </span>
        <br />
        Welcome To <span className="dashboard">TLA Dashboard</span>
      </h2>
    </div>
  );
}
