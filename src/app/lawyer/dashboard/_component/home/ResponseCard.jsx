import React from 'react';

export default function ResponseCard() {
  return (
    <div className="bg-white p-4 rounded-[10px] w-full">
      {/* Title */}
      <h3 className="text-black font-medium heading-md">Responses</h3>

      {/* Divider */}
      <hr className="border-t border-[#D9D9D9] my-[15px]" />
      <div className="flex items-center justify-center w-full h-[calc(100%-50px)] text-center">
        <p className="admin-text">Currently you have no responses.</p>
      </div>
    </div>
  );
}
