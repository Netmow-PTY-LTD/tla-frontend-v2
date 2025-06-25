'use client';
import React, { useEffect, useState } from 'react';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsRight from '../_component/LeadsRight';
import { usePathname } from 'next/navigation';
import LeadsHead from '../_component/LeadsHead';
import data from '@/data/user';
import { useGetAllLeadsQuery } from '@/store/features/lawyer/LeadsApiService';

const LeadBoardPage = () => {
  const [showLeadDetails, setShowLeadDetails] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  // const pathname = usePathname();

  // useEffect(() => {
  //   const cleanPathname = pathname?.trim().replace(/\/+$/, '');

  //   if (cleanPathname === '/lawyer/dashboard/leads-board') {
  //     window.scrollTo({ top: 0, behavior: 'auto' });

  //     document.body.style.setProperty('overflow', 'hidden', 'important');
  //   } else {
  //     document.body.style.overflow = '';
  //   }

  //   return () => {
  //     document.body.style.overflow = '';
  //   };
  // }, [pathname]);

  const { data: allLeads } = useGetAllLeadsQuery();

  useEffect(() => {
    if (allLeads?.data && allLeads?.data?.length > 0) {
      setSelectedLead(allLeads?.data[0]); // Set first lead
    }
  }, [allLeads?.data]);

  return (
    <div className="continer">
      <div className="lead-board-wrap">
        <div className="lead-board-container">
          {showLeadDetails && selectedLead && (
            <div className="left-column-7">
              <div className="column-wrap-left">
                <LeadDetailsPage
                  lead={selectedLead}
                  onBack={() => setShowLeadDetails(false)}
                />
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
                <LeadsHead isExpanded={!showLeadDetails} />
              </div>
              <div className="leads-bottom-row">
                <LeadsRight
                  isExpanded={!showLeadDetails}
                  onViewDetails={(lead) => {
                    setSelectedLead(lead);
                    setShowLeadDetails(true);
                  }}
                  data={allLeads?.data ?? []}
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
