import React from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import '@/styles/main.css';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
