import MainLayout from '@/components/main/common/layout';
import React from 'react';

export const metadata = {
  title: 'Blog Page || The Law App',
  description:
    'The Law App is a complete online marketplace for people to search for lawyers at a price they can afford and for lawyers to build an online presence to find clients without the need for heavy marketing expenses. We match clients to lawyers directly based on their field of expertise and allow fair bidding to reach the right price.',
  icons: {
    icon: '/assets/img/favicon.ico',
  },
};

export default function Blog() {
  return (
    <MainLayout>
      <section className="py-20">
        <div className="container">
          <h1>Blog</h1>
        </div>
      </section>
    </MainLayout>
  );
}
