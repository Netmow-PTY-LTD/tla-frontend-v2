import React from 'react';

export default function ResponseCard() {
  return (
    <div className="bg-white p-4 rounded-[10px] w-full">
      {/* Title */}
      <h1 className="text-black text-[18px] font-medium">Responses</h1>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-[14px]">
          Locations You haven’t responded to any leads yet You're receiving
          customers within 4207
        </p>
      </div>
    </div>
  );
}
