import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';

import { MapPin } from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LeadStatsCard = ({ locations, profile }) => {
  const defaultServices = profile?.profile?.serviceIds || [];

  console.log('profile:', profile);
  return (
    <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="w-full px-3 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-800">
              Credit Overview
            </h2>
            <p className="text-xs text-gray-500">
              Track your credit usage and balance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Total Purchased Credit */}
            <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <span className="text-xl">💳</span>
                <h4 className="text-xl font-bold text-black">120</h4>
              </div>
              <p className="text-xs text-gray-600 mt-1">Purchased Credits</p>
            </div>

            {/* Used Credit */}
            <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <span className="text-xl">🔥</span>
                <h4 className="text-xl font-bold text-black">80</h4>
              </div>
              <p className="text-xs text-gray-600 mt-1">Used Credits</p>
            </div>

            {/* Remaining Credit */}
            <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <span className="text-xl">✅</span>
                <h4 className="text-xl font-bold text-black">40</h4>
              </div>
              <p className="text-xs text-gray-600 mt-1">Remaining Credits</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex  items-center p-4 w-full">
        <div className="bg-[#F5F6F9]  w-1/2 flex flex-col justify-center items-center p-5 rounded-lg mx-4 my-3">
          <div className="flex items-center gap-2">
            <div>📈</div> {/* Replace with an actual icon if needed */}
            <h4 className="text-2xl font-bold text-black">20</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">pending responses</p>
        </div>
        <div className="bg-[#F5F6F9] w-1/2 flex flex-col justify-center items-center p-5 rounded-lg mx-4 my-3">
          <div className="flex items-center gap-2">
            <div>📈</div> {/* Replace with an actual icon if needed */}
            <h4 className="text-2xl font-bold text-black">20</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">Hired responses</p>
        </div>
      </div>

      <div>
        {/* Header */}
        <div className="m-3 flex justify-between items-center flex-wrap">
          <h2 className="font-medium text-lg">Lead Settings</h2>
          <h2 className="text-sm sm:text-base">
            <span>456</span> New Leads
          </h2>
        </div>
        <hr className="border-[#F3F3F3] border" />

        {/* Practice Area */}
        <div className="m-3">
          <div className="font-medium flex items-center text-lg">
            <h4> Practice Area</h4>
            <Link href={'/lawyer/settings/lead-settings'}>
              <button aria-label="Edit Practice Area" className="ml-3 rounded">
                <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
              </button>
            </Link>
          </div>
          <p className="my-2 text-sm sm:text-base">
            You'll receive leads in these categories
          </p>

          <div className="inline-flex flex-wrap gap-2 mt-2">
            <div className="flex flex-wrap gap-2">
              {defaultServices?.length > 0 ? (
                defaultServices.map((service, index) => (
                  <span
                    key={service?._id || index}
                    className="bg-[#F3F3F3] text-sm text-[#0B1C2D] px-3 py-1 rounded-full"
                  >
                    {service?.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">
                  No practice areas found
                </span>
              )}
            </div>
          </div>
        </div>
        <hr className="border-[#F3F3F3] border" />

        {/* Locations */}
        <div className="m-3">
          <h1 className="font-medium flex items-center text-lg">
            <h4> Locations</h4>
            <Link href={'/lawyer/settings/lead-settings'}>
              <button aria-label="Edit Locations" className="ml-3 rounded">
                <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
              </button>
            </Link>
          </h1>
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
        <hr className="border-[#F3F3F3] border" />

        {/* CTA Button */}
        <div className="m-3">
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
