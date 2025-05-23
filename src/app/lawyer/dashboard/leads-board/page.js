'use client';
import React, { useEffect, useState } from 'react';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsRight from '../_component/LeadsRight';
import { usePathname } from 'next/navigation';
import LeadsHead from '../_component/LeadsHead';

const LeadBoardPage = () => {
  const [showLeadDetails, setShowLeadDetails] = useState(true);

  const pathname = usePathname();

  console.log('pathname', pathname);

  useEffect(() => {
    const cleanPathname = pathname?.trim().replace(/\/+$/, '');

    if (cleanPathname === '/lawyer/dashboard/leads-board') {
      document.body.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname]);

  return (
    <div className="continer">
      {/* <div className="flex flex-wrap">
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
      </div> */}
      <div className="lead-bord-wrap">
        <div className="lead-board-container">
          {/* <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 lg:w-2/3">
              <LeadDetailsPage onBack={() => setShowLeadDetails(false)} />
            </div>
            <div
              className={
                showLeadDetails ? 'w-full md:w-1/2 lg:w-1/3' : 'w-full'
              }
            >
              <LeadsRight
                isExpanded={!showLeadDetails}
                onViewDetails={() => setShowLeadDetails(true)}
              />
            </div>
          </div>{' '} */}

          {showLeadDetails && (
            <div className="left-column-7">
              <div className="column-wrap-left">
                <LeadDetailsPage onBack={() => setShowLeadDetails(false)} />
              </div>
            </div>
          )}

          <div
            className={`${
              showLeadDetails ? 'right-column-5 ' : 'right-column-full'
            }`}
          >
            <div className="column-wrap-right">
              <div className="leads-top-row">
                <LeadsHead />
              </div>
              <div className="leads-bottom-row">
                <LeadsRight
                  isExpanded={!showLeadDetails}
                  onViewDetails={() => setShowLeadDetails(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadBoardPage;
