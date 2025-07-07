'use client';
import React, { useEffect, useState } from 'react';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsRight from '../_component/LeadsRight';
import { usePathname } from 'next/navigation';
import LeadsHead from '../_component/LeadsHead';
import { useGetAllLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import { Inbox, Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ResponseSkeleton from '../my-responses/_components/ResponseSkeleton';

const LeadBoardPage = () => {
  const [showLeadDetails, setShowLeadDetails] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

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

  const { data: allLeads, isLoading: isAllLeadsLoading } =
    useGetAllLeadsQuery();

  // useEffect(() => {
  //   if (allLeads?.data && allLeads?.data?.length > 0) {
  //     setSelectedLead(allLeads?.data[0]); // Set first lead
  //   }
  // }, [allLeads?.data]);
  useEffect(() => {
    if (selectedLeadId && allLeads?.data?.length > 0) {
      const leadData = allLeads.data.find(
        (lead) => lead._id === selectedLeadId
      );
      if (leadData) {
        setSelectedLead(leadData);
      }
    }
  }, [selectedLeadId, allLeads?.data]);

  if (isAllLeadsLoading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        {/* Header section */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Content blocks */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Avatar skeleton */}
            <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
            {/* Text block */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}

        {/* Table or card-like block */}
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-1/3" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lead-board-wrap">
      {allLeads?.data?.length > 0 ? (
        <div className="lead-board-container">
          {showLeadDetails && selectedLead ? (
            <div className="left-column-7">
              <div className="column-wrap-left">
                <LeadDetailsPage
                  lead={selectedLead}
                  onBack={() => setShowLeadDetails(false)}
                />
              </div>
            </div>
          ) : showLeadDetails ? (
            <div className="left-column-7">
              <div className="column-wrap-left">
                <ResponseSkeleton /> {/* Show while selectedLead is loading */}
              </div>
            </div>
          ) : null}

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
                    setSelectedLeadId(lead._id);
                  }}
                  data={allLeads?.data ?? []}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Inbox className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="italic text-[18px] text-gray-500">
            Currently you have no leads.
          </h4>
        </div>
      )}
    </div>
  );
};

export default LeadBoardPage;
