'use client';
import MainLayout from '@/components/main/common/layout';
import { useParams } from 'next/navigation';
import React from 'react';

export default function BlogDetailsPage() {
  const params = useParams();
  const { slug } = params;
  return (
    <MainLayout>
      <section className="py-20">
        <div className="container">
          <h1>Blog Details Page - {slug}</h1>
        </div>
      </section>
    </MainLayout>
  );
}
