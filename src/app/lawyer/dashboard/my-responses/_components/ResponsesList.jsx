'use client';
import React, { useEffect, useState } from 'react';
import ResponseCard from '../../_component/home/ResponseCard';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useRealTimeStatus } from '@/hooks/useSocketListener';

const LeadsRight = ({
  isExpanded,
  onViewDetails,
  data,
  setIsLoading,
  selectedResponse,
  selectedResponseId,
  setSelectedResponseId,
  searchParams,
}) => {
  const currentUserId = useSelector(selectCurrentUser)?._id;
  const [onlineMap, setOnlineMap] = useState({});
  // Safely extract user IDs from AllLeadData
  const userIds =
    data?.map((response) => response?.leadId?.userProfileId?.user?._id) || [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, userIds, (userId, isOnline) => {
    setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
  });

  // useEffect(() => {
  //   console.log("data", data);
  //   console.log("onlineMap", onlineMap);
  // }, [data, onlineMap]);

  console.log('data', data);

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
        {data.map((user, i) => (
          <ResponseCard
            key={i}
            onViewDetails={onViewDetails}
            user={user}
            isExpanded={isExpanded}
            setIsLoading={setIsLoading}
            onlineMap={onlineMap}
            selectedResponse={selectedResponse}
            selectedResponseId={selectedResponseId}
            setSelectedResponseId={setSelectedResponseId}
            searchParams={searchParams}
          />
        ))}
      </section>
    </>
  );
};

export default LeadsRight;
