import React from 'react';
import '../../styles/dashboard.css';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';

export default function AuthLayout({ children }) {
  return (
    <>
      <AuthHeader />
      <main>{children}</main>
      <AuthFooter />
    </>
  );
}
