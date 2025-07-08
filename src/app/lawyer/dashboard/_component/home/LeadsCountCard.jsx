import { useGetAllLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import React from 'react';

export default function LeadsCountCard() {
  const { data: allLeads, isLoading } = useGetAllLeadsQuery({
    page: 1,
    limit: 10,
  });

  const totalLeads = allLeads?.pagination?.total ?? 0;
  const approvedLeads =
    allLeads?.data?.filter((lead) => lead.status === 'approved')?.length ?? 0;
  const pendingLeads =
    allLeads?.data?.filter((lead) => lead.status === 'pending')?.length ?? 0;

  return (
    <div className="bg-white p-4 rounded-[10px] w-full">
      {/* Title */}
      <h3 className="text-black font-medium heading-md">Leads</h3>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Total Leads */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[#00C3C0] heading-md font-medium">
            {isLoading ? '...' : totalLeads}
          </h4>
          <p className="text-[#34495E] mt-[5px]">Total leads</p>
        </div>
        <button className="text-[#8E8E8E] text-[14px]">Edit</button>
      </div>

      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Approved Leads */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-green-600 heading-md font-medium">
            {isLoading ? '...' : approvedLeads}
          </h4>
          <p className="text-[#34495E] mt-[5px]">Approved leads</p>
        </div>
        <button className="text-[#8E8E8E] text-[14px]">Edit</button>
      </div>

      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Pending Leads */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-yellow-500 heading-md font-medium">
            {isLoading ? '...' : pendingLeads}
          </h4>
          <p className="text-[#34495E] mt-[5px]">Pending leads</p>
        </div>
        <button className="text-[#8E8E8E] text-[14px]">Edit</button>
      </div>
    </div>
  );
}
