import MapMarkerAlt from '@/components/icon/MapMarkerAlt';
import React from 'react';
import ShowServiceList from './ShowServiceList';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function LeadSettingsCard({
  services,
  isLoading,
  isError,
  error,
  locations,
}) {
  return (

    
    <Card className="w-full rounded-2xl shadow-sm">
      <div className="p-4">
        <h3 className="heading-md font-medium text-black">Lead Settings</h3>
      </div>

      <hr className="my-4 border-t border-[#D9D9D9]" />

      {/* Services Section */}
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="heading-base font-medium text-black">Services</h2>
          <p className="mt-1 text-sm text-[#34495E]">
            You'll receive leads in these categories
          </p>
        </div>
        <Link
          href="/lawyer/settings/lead-settings"
          className="text-sm text-[#8E8E8E] hover:underline"
        >
          Edit
        </Link>
      </div>

      {/* Services Tags */}
      <div className="mt-4 flex flex-wrap gap-3 px-4">
        <ShowServiceList
          services={services}
          isLoading={isLoading}
          error={error}
          isError={isError}
        />
      </div>

      <hr className="my-4 border-t border-[#D9D9D9]" />

      {/* Locations Section */}
      <div className="px-4">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h4 className="heading-base font-medium text-black">Locations</h4>
            <p className="mt-1 text-sm text-[#34495E]">
              You're receiving client within
            </p>

            {isLoading ? (
              <div className="mt-4 space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-28 animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            ) : isError ? (
              <p className="mt-4 text-sm text-red-500">
                {error?.data?.message || 'Failed to load locations'}
              </p>
            ) : locations?.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No locations found</p>
            ) : (
              <div className="mt-4 space-y-3">
                {locations.map((item, index) => (
                  <div key={item._id || index} className="flex items-center gap-2">
                    <MapMarkerAlt className="h-4 w-4 text-black" />
                    <span className="text-sm text-black">
                      {item?.locationGroupId?.zipcode}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/lawyer/settings/lead-settings"
            className="text-sm text-[#8E8E8E] hover:underline"
          >
            Edit
          </Link>
        </div>
      </div>
    </Card>

  );
}
