'use client';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import React from 'react';

const LeadsRight = ({ isExpanded, onViewDetails, data }) => {
  return (
    <>
      {/* lead card section */}
      <section
        className={`grid ${
          isExpanded
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-4 lg:pr-4'
            : 'grid-cols-1 p-4 md:pr-1'
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
