'use client';
import React, {
  use,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsRight from '../_component/LeadsRight';
import { usePathname } from 'next/navigation';
import LeadsHead from '../_component/LeadsHead';
import {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
} from '@/store/features/lawyer/LeadsApiService';
import { Inbox, Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ResponseSkeleton from '../my-responses/_components/ResponseSkeleton';

const LeadBoardPage = () => {
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(true);
  const scrollContainerRef = useRef(null);

  const { data, isLoading, isFetching } = useGetAllLeadsQuery(
    {
      page,
      limit: 10,
    },
    { keepPreviousData: true, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (!data) return;

    setLeads((prev) => [...prev, ...data.data]);
    const totalPage = data.pagination.totalPage;
    setHasMore(page < totalPage);
  }, [data, page]);

  //console.log('leads', leads);
  //console.log('hasMore', hasMore);

  // Set first lead on initial load or leads update
  useEffect(() => {
    if (leads.length > 0 && !selectedLead) {
      setSelectedLead(leads[0]);
    }
  }, [leads, selectedLead]);

  const selectedLeadId = selectedLead?._id;

  // Fetch detailed data for selected lead
  const {
    data: selectedLeadData,
    isLoading: isSingleLeadLoading,
    isFetching: isSingleLeadFetching,
  } = useGetSingleLeadQuery(selectedLeadId, { skip: !selectedLeadId });


  // Scroll event handler for infinite loading
  useEffect(() => {
    const container = scrollContainerRef.current;
    console.log('container', container);
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

  console.log('scrollContainerRef', scrollContainerRef?.current);

  if (isLoading && page === 1) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="lead-board-wrap">
      {leads.length > 0 ? (
        <div className="lead-board-container">
          {showLeadDetails && selectedLead && (
            <div className="left-column-7">
              <div className="column-wrap-left">
                {isSingleLeadLoading || isSingleLeadFetching ? (
                  <ResponseSkeleton />
                ) : (
                  <LeadDetailsPage
                    lead={selectedLead}
                    singleLead={selectedLeadData?.data}
                    onBack={() => setShowLeadDetails(false)}
                  />
                )}
              </div>
            </div>
          )}

          <div
            className={`${
              showLeadDetails ? 'right-column-5' : 'right-column-full'
            }`}
          >
            <div className="column-wrap-right">
              <div className="leads-top-row">
                <LeadsHead
                  isExpanded={!showLeadDetails}
                  total={data?.pagination?.total}
                />
              </div>
              <div className="leads-bottom-row" ref={scrollContainerRef}>
                <LeadsRight
                  isExpanded={!showLeadDetails}
                  onViewDetails={(lead) => {
                    setSelectedLead(lead);
                    setShowLeadDetails(true);
                  }}
                  data={leads || []}
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
            Currently you have no leads.
          </h4>
        </div>
      )}
    </div>
  );
};

export default LeadBoardPage;
