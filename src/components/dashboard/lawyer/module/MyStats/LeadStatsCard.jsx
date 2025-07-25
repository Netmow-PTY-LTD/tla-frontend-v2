'use client';
import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';

import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import { useGetAllMyResponsesQuery } from '@/store/features/lawyer/ResponseApiService';

import { Archive, CheckCircle, Flame, MapPin, Users,XCircle } from 'lucide-react';
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
    allMyResponses?.data?.filter((response) => response.status === 'reject')
      ?.length ?? 0;
  const pendingLead =
    allMyResponses?.data?.filter((response) => response.status === 'pending')
      ?.length ?? 0;
  const archiveLead =
    allMyResponses?.data?.filter((response) => response.status === 'archive')
      ?.length ?? 0;
  const approveLead =
    allMyResponses?.data?.filter((response) => response.status === 'approve')
      ?.length ?? 0;

  return (
    <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="w-full p-4">
        <div className="mb-4 text-center md:text-left">
          <h2 className="text-lg font-semibold text-gray-800">
            My Leads Overview
          </h2>
          <p className="text-xs text-gray-500">
            Track your lead
          </p>
        </div>
 

        {/* ---------------------------------- Lead Related Ui ------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {/* Total Leads */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <Users className="w-5 h-5 text-blue-600" />
              <h4 className="text-xl font-bold text-black">{totalLeads}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Total Leads</p>
          </div>

          {/* Approved Leads */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <h4 className="text-xl font-bold text-black">{approveLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Approved Leads</p>
          </div>

          {/* Pending Leads */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="text-xl font-bold text-black">{pendingLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Pending Leads</p>
          </div>

          {/* Rejected Leads */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <XCircle className="w-5 h-5 text-red-500" />
              <h4 className="text-xl font-bold text-black">{rejectLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Rejected Leads</p>
          </div>

          {/* Archived Leads */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <Archive className="w-5 h-5 text-gray-500" />
              <h4 className="text-xl font-bold text-black">{archiveLead}</h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Archived Leads</p>
          </div>
        </div>



      </div>

      <div className="w-full px-4 pb-4 pt-2">
        <hr className="border-[#F3F3F3] border" />

        {/* Locations */}
        <div className="mt-4">
          <div className="font-medium flex items-center gap-2 text-lg">
            <h4 className="leading-none"> Locations</h4>
            <Link href={'/lawyer/settings/lead-settings'}>
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </Link>
          </div>
          <p className="my-2 text-sm sm:text-base">
            You're receiving customers within
          </p>

          <div className="mt-[15px] space-y-3">
            {locations?.map((location, index) => {
              return (
                <p
                  key={location._id || index}
                  className="text-[#0B1C2D] bg-[#F3F3F3] rounded-lg p-4 flex items-center"
                >
                  <MapPin className="mr-2 w-4 h-4 text-gray-600" />
                  <span>{location?.locationGroupId?.zipcode}</span>
                </p>
              );
            })}
          </div>
        </div>
        <hr className="border-[#F3F3F3] border mt-4" />

        {/* CTA Button */}
        <div className="mt-4">
          <Link href={'/lawyer/dashboard/leads-board'}>
            <button className="px-[19px] py-2 text-[#0B1C2D]  hover:bg-[#00C3C0] hover:text-white  font-medium bg-[#EDF0F4] rounded-full text-sm sm:text-base">
              View Leads
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
