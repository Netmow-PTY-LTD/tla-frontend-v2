import Footer from '@/components/main/common/footer/Footer';
import Header from '@/components/main/common/header/Header';
import React from 'react';
import '@/styles/main.css';
import LawFirmHeader from './_components/LawFirmHeader';

export default function LawFirmLayout({ children }) {
  return (
    <>
      <LawFirmHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
