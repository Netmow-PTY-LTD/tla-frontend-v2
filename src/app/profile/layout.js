import Footer from '@/components/main/common/footer/Footer';
import Header from '@/components/main/common/header/Header';
import React from 'react';

const ProfileLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
