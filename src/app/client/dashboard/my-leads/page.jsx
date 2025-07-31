'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ClientLeadCard from '../../_components/ClientLeadCard';
import ClientNewLeadRegistrationModal from '../../_components/ClientNewLeadRegistrationModal';
import JobRequest from '../../_components/JobRequest';
import { Loader } from 'lucide-react';

export default function MyLeads() {
  const [modalOpen, setModalOpen] = useState(false);
  const [leads, setLeads] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);

  const {
    data: allMyLeads,
    isLoading: isAllMyLeadsLoading,
    isFetching,
  } = useGetAllMyLeadsQuery(
    { page, limit: 10 },
    { keepPreviousData: true, refetchOnMountOrArgChange: true }
  );

  console.log('allMyLeads', allMyLeads);

  const { data: countryList } = useGetCountryListQuery();

  const defaultCountry = countryList?.data?.find(
    (country) => country?.slug === 'au'
  );

  // Default to Australia (AU) if available
  const { data: countryWiseServices } = useGetCountryWiseServicesQuery(
    defaultCountry?._id,
    {
      skip: !defaultCountry?._id, // Skip
    }
  );

  useEffect(() => {
    if (!allMyLeads) return;

    setLeads((prev) => {
      const updatedLeads =
        page === 1 ? allMyLeads?.data : [...prev, ...allMyLeads?.data];
      // Automatically select the first lead when page = 1 (new filter)
      // if (page === 1 && updatedLeads.length > 0) {
      //   setSelectedLead(updatedLeads[0]);
      // }
      return updatedLeads;
    });
    const totalPage = allMyLeads?.pagination?.totalPage;
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
  }, [allMyLeads?.data, page]);

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

  if (isAllMyLeadsLoading) {
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
      <div className="rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Leads</h2>
          <Button
            className="text-white py-[10px] px-[20px] rounded-[5px] bg-[#00C3C0]"
            onClick={() => setModalOpen(true)}
          >
            Create New Lead
          </Button>
        </div>
        <div className="max-h-[calc(100vh-170px)] overflow-y-auto">
          <div className="mt-5 max-w-[1400px] mx-auto" ref={scrollContainerRef}>
            {leads?.length === 0 && (
              <JobRequest modalOpen={modalOpen} setModalOpen={setModalOpen} />
            )}

            {leads?.length > 0 && (
              <>
                {/* <div className="flex justify-between items-center my-5">
              <FilterDropdown />
              <button className="bg-green-700 p-[10px] flex items-center gap-2 text-white rounded-lg">
                <CircleX className="w-4 h-4" /> <span>Approve</span>
              </button>
            </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 mt-5 pr-2">
                  {leads?.map((lead, index) => (
                    // <JobPostCard key={index} lead={lead} />
                    <ClientLeadCard key={index} user={lead} />
                  ))}
                  {hasMore && (
                    <div className="py-6 text-center">
                      <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ClientNewLeadRegistrationModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={() => setModalOpen(false)}
        defaultCountry={defaultCountry}
        countryWiseServices={countryWiseServices?.data}
        allMyLeads={allMyLeads?.data}
      />
    </>
  );
}
