import { MapPin } from 'lucide-react';
import React from 'react';

export default function SendNewLeadsCard() {
  return (
    <div className="bg-white p-4 rounded-[10px] w-full">
      {/* Title */}
      <h1 className="text-black text-[18px] font-medium">
        Estimated 10 leads per day
      </h1>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Services Section */}
      <div className="">
        <div>
          <h2 className="text-black font-medium">Sending new leads to </h2>
          <p className="text-[#34495E] mt-[5px]">forhad.netmow@gmail.com</p>
        </div>
        <button className="text-[##00C3C0] text-[14px] mt-2">Change</button>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Locations Section */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-black font-medium">Locations</h2>
            <p className="text-[#34495E] mt-[5px]">
              You're receiving customers within
            </p>
          </div>
          <button className="text-[#8E8E8E] text-[14px] ">Edit</button>
        </div>

        {/* Location Display */}
        <div className="flex items-center gap-2 mt-[15px] mb-3">
          <MapPin className="text-black h-4 w-4" />
          <span className="text-black text-sm">4207</span>
        </div>
      </div>
    </div>
  );
}
