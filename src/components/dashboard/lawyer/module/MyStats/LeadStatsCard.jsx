'use client';
import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';
import { useGetUserCreditStatsQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import { useGetAllMyResponsesQuery } from '@/store/features/lawyer/ResponseApiService';

import { MapPin } from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LeadStatsCard = ({ locations, profile }) => {
  const { data } = useGetUserCreditStatsQuery();
  const defaultServices = profile?.profile?.serviceIds || [];
  const creditStats = data?.data || {};

  const { data: allMyResponses, isLoading } = useGetAllMyResponsesQuery();

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

  return (
    <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="w-full p-4">
        <div className="mb-4 text-center md:text-left">
          <h2 className="text-lg font-semibold text-gray-800">
            My Leads Overview
          </h2>
          <p className="text-xs text-gray-500">
            Track your credit usage and balance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Total Purchased Credit */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-xl">💳</span>
              <h4 className="text-xl font-bold text-black">
                {creditStats?.totalPurchasedCredits}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Total Leads</p>
          </div>

          {/* Used Credit */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-xl">🔥</span>
              <h4 className="text-xl font-bold text-black">
                {' '}
                {creditStats?.totalUsedCredits}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Approved Leads</p>
          </div>

          {/* Remaining Credit */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-xl">✅</span>
              <h4 className="text-xl font-bold text-black">
                {creditStats?.remainingCredits}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Pending Leads</p>
          </div>
          {/* Remaining Credit */}
          <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-xl">✅</span>
              <h4 className="text-xl font-bold text-black">
                {creditStats?.remainingCredits}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Hired Leads</p>
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
