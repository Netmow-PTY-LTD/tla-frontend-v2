// PaginatedScroll.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGetAllLeadsQuery } from '@/store/features/lawyer/LeadsApiService';

const LIMIT = '10';

const PaginatedScroll = () => {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const [totalPages, setTotalPages] = useState(null);

  const { data, isFetching } = useGetAllLeadsQuery({
    page,
    limit: LIMIT,
  });

  console.log('isFetching', isFetching);
  console.log('data', data);
  const loader = useRef(null);

  // Append new data to existing list
  useEffect(() => {
    if (data && data.data.length > 0) {
      setTotalPages(data.pagination.totalPage);
      setAllData((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching) {
          if (totalPages && page >= totalPages) return;
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [isFetching]);

  console.log('allData', allData);

  return (
    <div style={{ height: '80vh', overflow: 'auto', padding: '10px' }}>
      {allData.map((item, index) => (
        <div
          key={item.id || index}
          style={{ padding: '10px', borderBottom: '1px solid #ddd' }}
        >
          {JSON.stringify(item)}
        </div>
      ))}

      <div ref={loader} style={{ padding: '20px', textAlign: 'center' }}>
        {isFetching ? 'Loading more...' : 'Scroll to load more'}
      </div>
    </div>
  );
};

export default PaginatedScroll;
