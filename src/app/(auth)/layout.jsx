import React from 'react';
import '../../styles/dashboard.css';
import AuthHeader from '@/components/auth/AuthHeader';

export default function AuthLayout({ children }) {
  return (
    <>
      <AuthHeader />
      <main>{children}</main>
    </>
  );
}
