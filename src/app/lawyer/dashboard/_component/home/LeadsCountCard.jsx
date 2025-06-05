import React from 'react';

export default function LeadsCountCard() {
  return (
    <div className="bg-white p-4 rounded-[10px] w-full">
      {/* Title */}
      <h3 className="text-black font-medium heading-md">Leads</h3>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Services Section */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[#00C3C0] heading-md font-medium">118</h4>
          <p className="text-[#34495E] mt-[5px]">Number of leads</p>
        </div>
        <button className="text-[#8E8E8E] text-[14px]">Edit</button>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />

      {/* Locations Section */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#00C3C0] font-medium">118</h2>
            <p className="text-[#34495E] mt-[5px]">Unread leads</p>
          </div>
          <button className="text-[#8E8E8E] text-[14px]">Edit</button>
        </div>
      </div>
    </div>
  );
}
