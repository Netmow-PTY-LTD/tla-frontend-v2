'use client';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import React from 'react';

const LeadsRight = ({ isExpanded, onViewDetails, data }) => {
  return (
    <>
      {/* lead card section */}
      <section
        className={`grid ${
          isExpanded ? 'grid-cols-3 py-4 pr-4' : 'grid-cols-1 p-4'
        } gap-4`}
      >
        {data.map((user, i) => (
          <LeadCard
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
