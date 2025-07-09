'use client';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import React from 'react';

const LeadsRight = ({ isExpanded, onViewDetails, data }) => {
  return (
    <>
      {/* lead card section */}
      <section
        className={`grid ${
          isExpanded ? 'grid-cols-3 py-4 pr-4' : 'grid-cols-1 p-4 pr-2'
        } gap-4`}
      >
        {data?.map((lead, i) => (
          <LeadCard
            key={i}
            onViewDetails={onViewDetails}
            user={lead}
            isExpanded={isExpanded}
          />
        ))}
      </section>
    </>
  );
};

export default LeadsRight;
