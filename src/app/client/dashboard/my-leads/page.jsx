'use client';
import React, { useState } from 'react';
import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ClientLeadCard from '../../_components/ClientLeadCard';
import ClientNewLeadRegistrationModal from '../../_components/ClientNewLeadRegistrationModal';
import JobRequest from '../../_components/JobRequest';

export default function MyLeads() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: allMyLeads, isLoading: isAllMyLeadsLoading } =
    useGetAllMyLeadsQuery(
      { page: 1, limit: 10 },
      { keepPreviousData: true, refetchOnMountOrArgChange: true }
    );

  console.log('All My Leads:', allMyLeads);

  const totalLeads = allMyLeads?.pagination?.total ?? 0;

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
        <div className="mt-5 mx-auto">
          {allMyLeads?.data?.length === 0 && (
            <JobRequest modalOpen={modalOpen} setModalOpen={setModalOpen} />
          )}

          {allMyLeads?.data?.length > 0 && (
            <>
              {/* <div className="flex justify-between items-center my-5">
              <FilterDropdown />
              <button className="bg-green-700 p-[10px] flex items-center gap-2 text-white rounded-lg">
                <CircleX className="w-4 h-4" /> <span>Approve</span>
              </button>
            </div> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 mt-5">
                {allMyLeads?.data?.map((lead, index) => (
                  // <JobPostCard key={index} lead={lead} />
                  <ClientLeadCard key={index} user={lead} />
                ))}
              </div>
            </>
          )}
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
