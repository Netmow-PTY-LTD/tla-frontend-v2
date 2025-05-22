'use client';
import React, { useEffect, useState } from 'react';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsRight from '../_component/LeadsRight';

const LeadBoardPage = () => {
  const [showLeadDetails, setShowLeadDetails] = useState(true);

  useEffect(() => {
    if (showLeadDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showLeadDetails]);

  return (
    <div className="continer">
      <div className="flex flex-wrap">
        {showLeadDetails && (
          <div className="w-full md:w-1/2 lg:w-2/3">
            <LeadDetailsPage onBack={() => setShowLeadDetails(false)} />
          </div>
        )}
        <div
          className={showLeadDetails ? 'w-full md:w-1/2 lg:w-1/3' : 'w-full'}
        >
          <LeadsRight
            isExpanded={!showLeadDetails}
            onViewDetails={() => setShowLeadDetails(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadBoardPage;
