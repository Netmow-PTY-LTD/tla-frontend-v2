'use client'; // if you're using Next.js App Router

import { selectCurrentUser } from '@/store/features/auth/authSlice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function SidebarTop() {
  const [greeting, setGreeting] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  const userInfo = useSelector(selectCurrentUser);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    // Set greeting based on hour
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Format the date
    const dateStr = now
      .toLocaleString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .replace(',', '')
      .replace(' at', '')
      .toLowerCase();

    setFormattedDate(dateStr);
  }, []);

  return (
    <div
      className="sidebar-top"
      style={{ backgroundImage: `url(/assets/img/bg-shape.png)` }}
    >
      <span className="capitalize">{formattedDate}</span>
      <h2>
        {greeting}, {userInfo?.username}! <br />
        Welcome To TLA Dashboard
      </h2>
      <div className="flex justify-between items-center mt-5">
        <div className="icon flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_313_6363)">
              <path
                d="M12.6663 14.6663H3.33301C2.22634 14.6663 1.33301 13.773 1.33301 12.6663V3.33301C1.33301 2.22634 2.22634 1.33301 3.33301 1.33301H12.6663C13.773 1.33301 14.6663 2.22634 14.6663 3.33301V12.6663C14.6663 13.773 13.773 14.6663 12.6663 14.6663Z"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 8H12"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 11.333H12"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 4.66699H12"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_313_6363">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>You have 3 jobs</span>
        </div>
        <Link href={'#'}>Post New</Link>
      </div>
    </div>
  );
}
