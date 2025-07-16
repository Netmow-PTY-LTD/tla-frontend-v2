'use client';
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { Arrow } from '@radix-ui/react-dropdown-menu';
import { ArrowDown, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isHeaderFixed, setIsHeaderFixed] = useState();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsHeaderFixed(window.scrollY > 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const token = Cookies.get('token');

  const dashboardPaths = {
    admin: '/admin',
    lawyer: '/lawyer/dashboard',
    client: '/client/dashboard',
  };

  const dashboardUrl = dashboardPaths[currentUser?.regUserType] || '';

  return (
    <header
      className={`${styles.main_header} ${isHeaderFixed ? styles.sticky : ''}`}
    >
      <div className="container-lg">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={'/assets/img/logo.png'}
              alt="TLA Logo"
              width={150}
              height={40}
            />
          </Link>
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/" className={styles.nav_link}>
                  <span>Explore</span>
                  <ChevronDown />
                </Link>
              </li>
              {/* <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Find Clients</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                  >
                    <path
                      d="M1.5 1L5.5 5L9.5 1"
                      stroke="#0B1C2D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Find Lawyers</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                  >
                    <path
                      d="M1.5 1L5.5 5L9.5 1"
                      stroke="#0B1C2D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </li> */}

              {/* <li>
                <Link href="/" className={styles.nav_link}>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={styles.nav_link}>
                  <span>Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.nav_link}>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.nav_link}>
                  <span>Contact</span>
                </Link>
              </li> */}
            </ul>
          </nav>
          {token && currentUser ? (
            <div className="flex items-center gap-4 ml-auto">
              <Link href={dashboardUrl} className={styles.nav_link}>
                <span>Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/login" className={styles.nav_link}>
                <span>Log In</span>
              </Link>
              <Link href="/register" className={styles.btn_register}>
                <span>Join as a Lawyer</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
