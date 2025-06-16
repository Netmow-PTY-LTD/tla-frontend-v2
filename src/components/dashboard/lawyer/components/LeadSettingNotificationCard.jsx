import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import React from 'react';
import TagButton from './TagButton';
import MapMarkerAlt from '@/components/icon/MapMarkerAlt';

const LeadSettingNotificationCard = ({
  services,
  isLoading,
  isError,
  error,
  locations,
}) => {
  return (
    <Card>
      <div className="m-3 flex justify-between items-center flex-wrap">
        <h2 className="font-medium text-lg">Lead Settings</h2>
        <h2 className="text-sm sm:text-base">
          <span>456</span> New Leads
        </h2>
      </div>
      <hr className="border-[#F3F3F3] border" />

      <div className="m-3">
        <h1 className="font-medium flex items-center text-lg">
          Practice Area
          <button aria-label="Edit Name" className="ml-3 rounded">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <p className="my-2 text-sm sm:text-base">
          You'll receive leads in these categories
        </p>

        <div className="inline-flex gap-2">
          <TagButton text="Child Custody Law" bgColor="#FF86021A" />
          <TagButton text="Separation Law" bgColor="#004DA61A" />
          <TagButton text="Criminal Law" bgColor="#A600161A" />
        </div>
      </div>
      <hr className="border-[#F3F3F3] border" />

      <div className="m-3">
        <h1 className="font-medium flex items-center text-lg">
          Locations
          <button aria-label="Edit Name" className="ml-3 rounded">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <p className="my-2 text-sm sm:text-base">
          You're receiving customers within
        </p>

        {isLoading ? (
          <div className="mt-4 space-y-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="w-[120px] h-[20px] bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="text-red-500 text-sm mt-4">
            {error?.data?.message || 'Failed to load locations'}
          </p>
        ) : !locations || locations.length === 0 ? (
          <p className="text-gray-500 text-sm mt-4">No locations found</p>
        ) : (
          <div className="mt-[15px] space-y-3">
            {locations.map((item, index) => {
              const zip = item?.locationGroupId?.zipcode;
              const key = item?._id || `${zip}-${index}`;
              if (!zip) return null; // Skip if zipcode is missing

              return (
                <p
                  key={key}
                  className="text-[#0B1C2D] bg-[#F3F3F3] rounded-lg p-4 flex items-center"
                >
                  <span className="mr-2">
                    <MapPin />
                  </span>
                  <span>{zip}</span>
                </p>
              );
            })}
          </div>
        )}
      </div>
      <hr className="border-[#F3F3F3] border" />

      <div className="m-3">
        <h1 className="font-medium flex items-center text-lg">
          Lead Notifications
          <button aria-label="Edit Name" className="ml-3 rounded">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <p className="my-2 text-sm sm:text-base">
          Sending new leads notifications to
        </p>
        <p className="text-sm sm:text-base">yourmail@example.com</p>
      </div>

      <div className="m-3">
        <button className="px-[19px] py-2 text-[#0B1C2D] font-medium bg-[#EDF0F4] rounded-full text-sm sm:text-base">
          View Leads
        </button>
      </div>
    </Card>
  );
};

export default LeadSettingNotificationCard;
