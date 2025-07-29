import MapMarkerAlt from '@/components/icon/MapMarkerAlt';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function SendNewLeadsCard({
  profile,
  locations,
  isLoading,
  isError,
  error,
}) {
  return (
    <Card className="shadow-sm rounded-2xl w-full">
      {/* Title */}
      <div className='p-4'>
        <h3 className="text-black font-medium heading-md">
          Estimated 10 leads per day
        </h3>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Services Section */}
      <div className="px-4">
        <div>
          <h4 className="text-black font-medium heading-base">
            Sending new leads to{' '}
          </h4>
          <p className="text-[#34495E] mt-[5px] admin-text">{profile?.email}</p>
        </div>
        <Link href={'/lawyer/settings/profile?section=about'}>  <button className="text-[#00C3C0] text-[14px] mt-2">Change</button></Link>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] " />

      {/* Locations Section */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h4 className="text-black font-medium heading-base">Locations</h4>
          <p className="text-[#34495E] text-[15px] mt-[5px]">
            You're receiving client within
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
    </Card>
  );
}
