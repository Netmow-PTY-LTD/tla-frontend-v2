'use client';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import React from 'react';

const LeadsRight = ({ isExpanded, onViewDetails }) => {
  return (
    <>
      {/* lead card section */}
      <section
        className={`grid ${
          isExpanded ? 'grid-cols-3 py-4 pr-4' : 'grid-cols-1 p-4'
        } gap-4`}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LeadCard key={i} onViewDetails={onViewDetails} />
        ))}
      </section>
    </>
  );
};

export default LeadsRight;
