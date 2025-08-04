'use client';
import React, { useEffect, useRef, useState } from 'react';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsRight from '../_component/LeadsRight';

import LeadsHead from '../_component/LeadsHead';
import {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
} from '@/store/features/lawyer/LeadsApiService';
import { Inbox, Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ResponseSkeleton from '../my-responses/_components/ResponseSkeleton';
import { Button } from '@/components/ui/button';

const LeadBoardPage = () => {
  const scrollContainerRef = useRef(null);

  const [showLeadDetails, setShowLeadDetails] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [parsed, setParsed] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(parsed || {});
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  // Load filter from localStorage on first mount

  useEffect(() => {
    const stored = localStorage.getItem('lead-filters');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setParsed(parsedData);
        setSearchKeyword(parsedData); // <-- Set it here
      } catch (err) {
        console.error('Invalid JSON in localStorage:', err);
      }
    } else {
      setSearchKeyword({});
    }
    setLeads([]);
  }, []);

  // Fetch paginated leads

  const {
    data,
    isLoading: isAllLeadsLoading,
    isFetching,
  } = useGetAllLeadsQuery({
    page,
    limit: 10,
    searchKeyword: JSON.stringify(searchKeyword || {}),
  });

  // Reset to page 1 on search keyword change
  useEffect(() => {
    setPage(1);
  }, [searchKeyword]);

  // Set leads and manage pagination state
  useEffect(() => {
    if (!data) return;

    setLeads((prev) => {
      const updatedLeads = page === 1 ? data.data : [...prev, ...data.data];
      // Automatically select the first lead when page = 1 (new filter)
      if (page === 1 && updatedLeads.length > 0) {
        setSelectedLead(updatedLeads[0]);
      }
      return updatedLeads;
    });

    if (page === 1 && typeof data?.pagination?.total === 'number') {
      setTotalLeadsCount(data.pagination.total);
    }

    const totalPage = data?.pagination?.totalPage;
    if (
      typeof totalPage !== 'number' ||
      totalPage <= 0 ||
      typeof totalPage == 'undefined' ||
      totalPage == null
    ) {
      setHasMore(false);
    } else {
      setHasMore(page < totalPage);
    }
  }, [data, page]);

  // Scroll event handler for infinite loading
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (nearBottom && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isFetching, scrollContainerRef?.current]);

  console.log({
    page,
    hasMore: scrollContainerRef.current,
    isFetching,
  });

  // Set first lead on initial load or leads update
  useEffect(() => {
    if (leads?.length > 0 && !selectedLead) {
      setSelectedLead(leads[0]);
    }
  }, [leads, selectedLead]);

  // Fetch detailed data for selected lead
  const { data: selectedLeadData, isLoading: isSingleLeadLoading } =
    useGetSingleLeadQuery(selectedLead?._id, { skip: !selectedLead?._id });

  // Show loading skeleton

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

  console.log('leads', leads);

  return (
    <div className="lead-board-wrap">
      {leads?.length > 0 ? (
        <div className="lead-board-container">
          {showLeadDetails && selectedLead && (
            <div className="left-column-8">
              {isSingleLeadLoading ? (
                <ResponseSkeleton />
              ) : (
                <div className="column-wrap-left bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
                  <LeadDetailsPage
                    lead={selectedLead}
                    onBack={() => setShowLeadDetails(false)}
                    singleLead={selectedLeadData?.data}
                    isSingleLeadLoading={isSingleLeadLoading}
                  />
                </div>
              )}
            </div>
          )}

          <div
            className={`${
              showLeadDetails ? 'right-column-4 ' : 'right-column-full'
            }`}
          >
            <div className="column-wrap-right" ref={scrollContainerRef}>
              <div className="leads-top-row">
                <LeadsHead
                  isExpanded={!showLeadDetails}
                  total={totalLeadsCount}
                  setSearchKeyword={setSearchKeyword}
                  searchKeyword={searchKeyword}
                  setLeads={setLeads}
                  setSelectedLead={setSelectedLead}
                  leads={leads}
                />
              </div>
              <div className="leads-bottom-row max-w-[1400px] mx-auto">
                <LeadsRight
                  isExpanded={!showLeadDetails}
                  onViewDetails={(lead) => {
                    setSelectedLead(lead);
                    setShowLeadDetails(true);
                  }}
                  // data={allLeads?.data ?? []}
                  data={leads ?? []}
                  selectedLead={selectedLead}
                />
                {hasMore && (
                  <div className="py-6 text-center">
                    <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Inbox className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="italic text-[18px] text-gray-500">
            Currently there are no leads.
          </h4>
          <Button
            className="mt-4"
            onClick={() => {
              localStorage.removeItem('lead-filters');
              window.location.href = '/lawyer/dashboard/leads-board';
            }}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadBoardPage;
