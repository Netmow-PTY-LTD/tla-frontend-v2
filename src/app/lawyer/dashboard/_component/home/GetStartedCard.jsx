import React from 'react';

export default function GetStartedCard() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative border shadow rounded-[10px] bg-white overflow-hidden max-w-[900px]">
        {/* Badge */}
        <div className="absolute right-0 top-0 p-2 bg-[#00C3C0] rounded-tr-[10px] rounded-bl-[10px]">
          <h2 className="text-sm font-medium text-white whitespace-nowrap">
            20% OFF Starter pack offer
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h4 className="text-black font-medium text-sm">Get Started</h4>
          <h1 className="text-[#00C3C0] font-semibold text-lg">
            Starter Pack Offer
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <p className="text-sm text-gray-700 leading-snug">
              Respond to up to 10 customers.{' '}
              <span className="text-[#00C3C0] font-medium">20% OFF</span> and a
              get hired guarantee.
            </p>
            <button className="text-[#00C3C0] text-sm font-medium hover:underline">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
