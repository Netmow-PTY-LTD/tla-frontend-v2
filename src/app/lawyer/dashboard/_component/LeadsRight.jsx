'use client';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import { useRealTimeStatus } from '@/hooks/useSocketListener';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const LeadsRight = ({ isExpanded, onViewDetails, data, selectedLead }) => {
  const currentUserId = useSelector(selectCurrentUser)?._id;
  const [onlineMap, setOnlineMap] = useState({});
  // Safely extract user IDs from AllLeadData
  const userIds = data?.map((lead) => lead.userProfileId?.user?._id) || [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, userIds, (userId, isOnline) => {
    setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
  });

  useEffect(() => {
    //console.log('data', data);
    //console.log('onlineMap', onlineMap);
  }, [data, onlineMap]);

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
            onlineMap={onlineMap}
            selectedLead={selectedLead}
            index={i}
          />
        ))}
      </section>
    </>
  );
};

export default LeadsRight;
