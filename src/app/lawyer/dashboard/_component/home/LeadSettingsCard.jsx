import MapMarkerAlt from '@/components/icon/MapMarkerAlt';
import React from 'react';
import ShowServiceList from './ShowServiceList';
import Link from 'next/link';

export default function LeadSettingsCard({
  services,
  isLoading,
  isError,
  error,
  locations,
}) {
  return (
    <div className="bg-white p-4 rounded-[10px] w-full">
      {/* Title */}
      <h3 className="text-black font-medium heading-md">Lead Settings</h3>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Services Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black font-medium heading-base">Services</h2>
          <p className="text-[#34495E] text-[15px] mt-[5px]">
            You'll receive leads in these categories
          </p>
        </div>
        <Link
          href={'/lawyer/settings/lead-settings'}
          className="text-[#8E8E8E] text-[14px] hover:underline"
        >
          Edit
        </Link>
      </div>

      {/* Services Tags */}
      <div className="btn-group flex flex-wrap gap-3 mt-[15px]">
        <ShowServiceList
          services={services}
          isLoading={isLoading}
          error={error}
          isError={isError}
        />
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Locations Section */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-black font-medium heading-base">Locations</h4>
            <p className="text-[#34495E] text-[15px] mt-[5px]">
              You're receiving customers within
            </p>
            {/* Location Display */}

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
            ) : locations?.length === 0 ? (
              <p className="text-gray-500 text-sm mt-4">No locations found</p>
            ) : (
              <div className="mt-[15px] space-y-3">
                {locations.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-2"
                  >
                    <MapMarkerAlt className="text-black w-4 h-4" />
                    <span className="text-black text-sm">
                      {item?.locationGroupId?.zipcode}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link
            href={'/lawyer/settings/lead-settings'}
            className="text-[#8E8E8E] text-[14px] hover:underline"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
