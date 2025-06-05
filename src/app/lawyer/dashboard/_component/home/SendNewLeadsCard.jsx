import MapMarkerAlt from '@/components/icon/MapMarkerAlt';
import { MapPin } from 'lucide-react';
import React from 'react';

export default function SendNewLeadsCard() {
  return (
    <div className="bg-white p-4 rounded-[10px] w-full">
      {/* Title */}
      <h3 className="text-black font-medium heading-md">
        Estimated 10 leads per day
      </h3>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Services Section */}
      <div className="">
        <div>
          <h4 className="text-black font-medium heading-base">
            Sending new leads to{' '}
          </h4>
          <p className="text-[#34495E] mt-[5px] admin-text">
            forhad.netmow@gmail.com
          </p>
        </div>
        <button className="text-[#00C3C0] text-[14px] mt-2">Change</button>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Locations Section */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-black font-medium heading-base">Locations</h2>
            <p className="text-[#34495E] mt-[5px] admin-text">
              You're receiving customers within
            </p>
            {/* Location Display */}
            <div className="flex items-center gap-2 mt-[15px] mb-3">
              <MapMarkerAlt />
              <span className="text-black text-sm">4207</span>
            </div>
          </div>
          <button className="text-[#8E8E8E] text-[14px]">Edit</button>
        </div>
      </div>
    </div>
  );
}
