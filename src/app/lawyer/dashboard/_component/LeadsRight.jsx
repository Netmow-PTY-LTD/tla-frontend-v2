'use client';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import React from 'react';

const LeadsRight = ({ isExpanded, onViewDetails }) => {
  return (
    <>
      {/* lead card section */}
      <section
        className={`grid ${
          isExpanded ? 'grid-cols-3' : 'grid-cols-1'
        } gap-4 p-4`}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LeadCard key={i} onViewDetails={onViewDetails} />
        ))}
      </section>
    </>
  );
};

export default LeadsRight;
