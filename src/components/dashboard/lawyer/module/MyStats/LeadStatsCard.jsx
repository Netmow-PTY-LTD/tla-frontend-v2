'use client';
import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';

import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import { useGetAllMyResponsesQuery } from '@/store/features/lawyer/ResponseApiService';

import {
  Archive,
  CheckCircle,
  Flame,
  MapPin,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LeadStatsCard = ({ locations, profile }) => {
  const { data: allMyLeads, isLoading: isAllMyLeadsLoading } =
    useGetAllMyLeadsQuery(
      { page: 1, limit: 10 },
      { keepPreviousData: true, refetchOnMountOrArgChange: true }
    );
  const { data: allMyResponses, isLoading } = useGetAllMyResponsesQuery();

  // -------------------------- Response related context ----------------------------------
  const totalResponse = allMyResponses?.data.length ?? 0;
  const hiredResponse =
    allMyResponses?.data?.filter((response) => response.status === 'hired')
      ?.length ?? 0;
  const pendingResponse =
    allMyResponses?.data?.filter((response) => response.status === 'pending')
      ?.length ?? 0;
  const archiveResponse =
    allMyResponses?.data?.filter((response) => response.status === 'archive')
      ?.length ?? 0;

  // ----------------------- lead related context -----------------------------------------------

  const totalLeads = allMyLeads?.pagination?.total ?? 0;

  const rejectLead =
    allMyLeads?.data?.filter((lead) => lead.status === 'rejected')?.length ?? 0;
  const pendingLead =
    allMyLeads?.data?.filter((lead) => lead.status === 'pending')?.length ?? 0;
  const archiveLead =
    allMyLeads?.data?.filter((lead) => lead.status === 'archived')?.length ?? 0;
  const approveLead =
    allMyLeads?.data?.filter((lead) => lead.status === 'approved')?.length ?? 0;

  // console.log(' allMyLeads', allMyLeads?.data);
  // console.log('approved lead', approveLead);

  return (
    <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto bg-white shadow-sm rounded-2xl">
      <div className="w-full">
        <div className="text-center md:text-left p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            My Cases Overview
          </h2>
          <p className="text-xs text-gray-500">Track your cases</p>
        </div>
        <hr className="border-t border-[#D9D9D9]" />

        {/* ---------------------------------- Lead Related Ui ------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 px-4">
          {/* Total Cases */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <Users className="w-5 h-5 text-blue-600" />
              <h4 className="text-xl font-bold text-black">{totalLeads}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Total Cases</p>
          </div>

          {/* Approved Cases */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <h4 className="text-xl font-bold text-black">{approveLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Approved Cases</p>
          </div>

          {/* Pending Cases */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="text-xl font-bold text-black">{pendingLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Pending Cases</p>
          </div>

          {/* Rejected Cases */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <XCircle className="w-5 h-5 text-red-500" />
              <h4 className="text-xl font-bold text-black">{rejectLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Rejected Cases</p>
          </div>

          {/* Archived Cases */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <Archive className="w-5 h-5 text-gray-500" />
              <h4 className="text-xl font-bold text-black">{archiveLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Archived Cases</p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 pb-4 pt-2">
        <hr className="border-[#F3F3F3] border mt-4" />

        {/* CTA Button */}
        <div className="mt-4">
          <Link href={'/client/dashboard/my-cases'}>
            <button className="px-[19px] py-2 text-[#0B1C2D]  hover:bg-[#00C3C0] hover:text-white  font-medium bg-[#EDF0F4] rounded-full text-sm sm:text-base">
              View Cases
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

LeadStatsCard.propTypes = {
  status: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  menuItems: PropTypes.array,
};

export default LeadStatsCard;
