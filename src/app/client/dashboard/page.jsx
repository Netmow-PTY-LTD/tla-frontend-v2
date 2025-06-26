'use client';
import React from 'react';
import JobPostCard from '../_components/JobPostCard';
import JobRequest from '../_components/JobRequest';
import { CircleX, Loader, SlidersHorizontal } from 'lucide-react';
import { FilterDropdown } from '../_components/FilterDropDwon';
import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import ClientLeadCard from '../_components/ClientLeadCard';

export default function BuyerDashboard() {
  const { data: allMyLeads, isLoading: isAllMyLeadsLoading } =
    useGetAllMyLeadsQuery();

  console.log('All My Leads:', allMyLeads);

  if (isAllMyLeadsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="flex items-center justify-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          loading...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Leads</h2>
        <button className="text-[#00C3C0] p-[10px] rounded-[5px] border border-[#00C3C0]">
          Create New Lead
        </button>
      </div>
      <div className="mt-5 mx-auto">
        {allMyLeads?.data?.length === 0 && <JobRequest />}

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
  );
}
