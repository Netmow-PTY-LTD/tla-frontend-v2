import MapMarkerAlt from '@/components/icon/MapMarkerAlt';
import React from 'react';
import ShowServiceList from './ShowServiceList';

export default function LeadSettingsCard({
  services,
  isLoading,
  isError,
  error,
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
        <button className="text-[#8E8E8E] text-[14px]">Edit</button>
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
            <div className="flex items-center gap-2 mt-[15px] mb-3">
              <MapMarkerAlt className="text-black" />
              <span className="text-black text-sm">4207</span>
            </div>
          </div>
          <button className="text-[#8E8E8E] text-[14px]">Edit</button>
        </div>
      </div>
    </div>
  );
}
