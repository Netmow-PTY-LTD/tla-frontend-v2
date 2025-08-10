// PaginatedScroll.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
} from '@/store/features/lawyer/LeadsApiService';
import ResponseSkeleton from '../my-responses/_components/ResponseSkeleton';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsHead from '../_component/LeadsHead';
import LeadsRight from '../_component/LeadsRight';
import { Inbox, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const LIMIT = '10';

const PaginatedScroll = () => {
  const [showLeadDetails, setShowLeadDetails] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [parsed, setParsed] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(parsed || {});
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  // workable code
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

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

  console.log('searchKeyword', searchKeyword);

  const {
    data,
    isLoading: isAllLeadsLoading,
    isFetching,
    refetch: refetchAllLeads,
  } = useGetAllLeadsQuery({
    page,
    limit: LIMIT,
    searchKeyword: JSON.stringify(searchKeyword || {}),
  });

  const loader = useRef(null);

  // Append new data to existing list
  useEffect(() => {
    if (data && data?.data?.length > 0) {
      setTotalPages(data?.pagination?.totalPage);
      setLeads((prev) => [...prev, ...data.data]);
      setTotalLeadsCount(data?.pagination?.total);
    }
  }, [data]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const scrollTarget = document.getElementById('scroll-target-for-data');
    if (!scrollTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching) {
          if (totalPages && page >= totalPages) return;
          setPage((prevPage) => prevPage + 1);
        }
      },
      { root: scrollTarget, threshold: 1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isFetching, totalPages]);

  useEffect(() => {
    if (leads?.length > 0 && !selectedLead) {
      setSelectedLead(leads[0]);
    }
  }, [leads, selectedLead]);

  // Fetch detailed data for selected lead
  const { data: selectedLeadData, isLoading: isSingleLeadLoading } =
    useGetSingleLeadQuery(selectedLead?._id, { skip: !selectedLead?._id });

  console.log('leads', leads);

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
    <>
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
              <div className="column-wrap-right" id="scroll-target-for-data">
                <div className="leads-top-row">
                  <LeadsHead
                    isExpanded={!showLeadDetails}
                    total={totalLeadsCount}
                    setSearchKeyword={setSearchKeyword}
                    searchKeyword={searchKeyword}
                    setLeads={setLeads}
                    setSelectedLead={setSelectedLead}
                    leads={leads}
                    page={page}
                    setPage={setPage}
                    urgent={data?.counts?.urgent || 0}
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
                </div>
                <div ref={loader}>
                  {isFetching ? (
                    <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <Inbox className="w-12 h-12 mb-4 text-gray-400" />
            <h4 className="italic text-[18px] text-gray-500">
              Currently there are no cases.
            </h4>
            <Button
              className="mt-4"
              onClick={() => {
                localStorage.removeItem('lead-filters');
                window.location.href = '/lawyer/dashboard/cases';
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PaginatedScroll;
