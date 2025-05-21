import { MapPin } from 'lucide-react';
import React from 'react';

export default function LeadSettingsCard() {
  return (
    <div>
      <div className="bg-white p-4 rounded-[10px]">
        {/* Title */}
        <h1 className="text-black text-[18px] font-medium">Lead Settings</h1>

        {/* Divider */}
        <hr className="border-t border-[#D9D9D9] my-[15px]" />

        {/* Services Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-black font-medium">Services</h2>
            <p className="text-[#34495E] mt-[5px]">
              You'll receive leads in these categories
            </p>
          </div>
          <button className="text-[#8E8E8E] text-[14px]">Edit</button>
        </div>

        {/* Services Tags */}
        <div className="btn-group flex flex-wrap gap-3 mt-[15px]">
          <button className="font-medium text-sm text-[#444444] rounded-[5px] border border-[#444444] px-[12px] py-[6px]">
            Contracts Lawyer
          </button>
          <button className="font-medium text-sm text-[#444444] rounded-[5px] border border-[#444444] px-[12px] py-[6px]">
            Estate Lawyer
          </button>
          <button className="font-medium text-sm text-[#444444] rounded-[5px] border border-[#444444] px-[12px] py-[6px]">
            Immigration Lawyers
          </button>
          <button className="font-medium text-sm text-[#444444] rounded-[5px] border border-[#444444] px-[12px] py-[6px]">
            +3
          </button>
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
            <button className="text-[#8E8E8E] text-[14px]">Edit</button>
          </div>

          {/* Location Display */}
          <div className="flex items-center gap-2 mt-[15px] mb-3">
            <MapPin className="text-black h-4 w-4" />
            <span className="text-black text-sm">4207</span>
          </div>
        </div>
      </div>
    </div>
  );
}
