'use client';
import React from 'react';
import ResponseCard from '../../_component/home/ResponseCard';

const LeadsRight = ({ isExpanded, onViewDetails, data }) => {
 
  return (
    <>
      {/* lead card section */}
      <section
        className={`grid ${
          isExpanded
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2 lg:pr-4'
            : 'grid-cols-1 p-4 md:pr-1'
        } gap-4`}
      >
        {data.map((user, i) => (
          <ResponseCard
            key={i}
            onViewDetails={onViewDetails}
            user={user}
            isExpanded={isExpanded}
           
          />
        ))}
      </section>
    </>
  );
};

export default LeadsRight;
