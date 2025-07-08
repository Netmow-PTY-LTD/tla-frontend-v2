'use client';
import React, { useEffect, useRef, useState } from 'react';

const allData = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `Item #${i + 1}`,
}));

const ITEMS_PER_PAGE = 20;
const SCROLL_THRESHOLD = 50; // px from bottom

const PaginationScrollPage = () => {
  const [visibleData, setVisibleData] = useState([]);
  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef(null);

  // Load initial 20 items
  useEffect(() => {
    const initialData = allData.slice(0, ITEMS_PER_PAGE);
    setVisibleData(initialData);
  }, []);

  // Append next items on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    console.log('container', container);
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom =
        scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;

      if (isNearBottom && visibleData.length < allData.length) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleData]);

  // Load more data when page increases
  useEffect(() => {
    const nextChunk = allData.slice(0, page * ITEMS_PER_PAGE);
    setVisibleData(nextChunk);
  }, [page]);

  return (
    <div
      ref={scrollContainerRef}
      className="loading-all-data-with-pagination"
      style={{
        height: '80vh',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '1rem',
      }}
    >
      <h2>Scrollable Data List</h2>
      <ul>
        {visibleData.map((item) => (
          <li
            key={item.id}
            style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}
          >
            {item.name}
          </li>
        ))}
      </ul>
      {visibleData.length < allData.length && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span>Loading more...</span>
        </div>
      )}
    </div>
  );
};

export default PaginationScrollPage;
