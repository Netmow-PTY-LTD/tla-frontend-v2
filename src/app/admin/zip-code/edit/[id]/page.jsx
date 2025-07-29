'use client';
import React, { Suspense, useEffect } from 'react';
import EditZipCodePage from '../../_components/ZipCodePage';

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <EditZipCodePage />
    </Suspense>
  );
}
