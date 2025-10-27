'use client';
import React, { useEffect, useState } from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import '@/styles/main.css';
import Preloader from '@/components/Preloader';

export default function MainLayout({ children }) {
  // const [isLoading, setIsLoading] = useState(true); // <- loading state

  // useEffect(() => {
  //   // Preloader simulation
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000); // <- Adjust duration as needed

  //   return () => clearTimeout(timer);
  // }, []);

  // // if (isLoading) {
  // //   return <Preloader />;
  // // }
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
