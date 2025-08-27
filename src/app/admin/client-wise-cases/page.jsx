'use client';

import { useGetClientWiseCasesQuery } from '@/store/features/client/ClientApiServices';
import React from 'react';

export default function ClientWiseCases() {
  const id = '68ac72eb6e7602fd7de9f7d1';
  const { data: clientWiseCases } = useGetClientWiseCasesQuery(id);
  console.log('clientWiseCases', clientWiseCases);
  return <div>ClientWise</div>;
}
