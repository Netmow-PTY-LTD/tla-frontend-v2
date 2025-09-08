import React from 'react';
import '../../styles/dashboard.css';
import AuthFooter from '@/components/auth/AuthFooter';
import '@/styles/main.css';
import Header from '@/components/main/common/header/Header';
import Footer from '@/components/main/common/footer/Footer';

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
