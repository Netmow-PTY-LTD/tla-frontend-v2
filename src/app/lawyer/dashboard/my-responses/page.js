'use client';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const MyResponsesPage = dynamic(() => import('./_components/MyResponsesPage'), {
  ssr: false,
});

const MyResponsePage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <MyResponsesPage />
    </Suspense>
  );
};

export default MyResponsePage;
