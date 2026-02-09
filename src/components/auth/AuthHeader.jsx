'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AuthHeader() {
  const pathname = usePathname();
  return (
    <header className="auth_header">
      <div className="container-lg">
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/">
              <img
                src={'/assets/img/logo-tla.svg'}
                alt={'TLA Logo'}
                className="h-[48px]"
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
