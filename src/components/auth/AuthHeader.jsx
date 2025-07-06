'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AuthHeader() {
  const pathname = usePathname();
  return (
    <header className="auth_header">
      <div className="container">
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Image
                src={'/assets/img/logo.png'}
                alt="TLA Logo"
                width={150}
                height={40}
              />
            </Link>
            <Link href="/" className="underline">
              <span>Back to home</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {pathname === '/register' && (
              <Link
                href="/login"
                className="btn-auth-login bg-[var(--primary-color)]"
              >
                <span>Log In</span>
              </Link>
            )}

            {pathname === '/login' && (
              <Link
                href="/register"
                className="btn_register bg-[var(--primary-color)]"
              >
                <span>Register as Lawyer</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
