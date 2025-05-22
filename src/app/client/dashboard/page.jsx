import React from 'react';

export default function BuyerDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Request</h2>
        <button className="text-[#00C3C0] p-[10px] rounded-[5px] border border-[#00C3C0]">
          Place a new request
        </button>
      </div>
      <div className="mt-5 ">
        <div className="bg-[#f3f3f380] rounded-[10px] h-full w-full flex flex-col items-center justify-center py-10 px-6 sm:px-10 md:px-20 lg:px-[100px] xl:px-[180px] 2xl:px-[247px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              Find services for your business on{' '}
              <span className="text-[#00c3c0]">The Law APP</span>
            </h2>
            <p className="mt-4 text-base text-gray-700">
              Most businesses could be getting a better deal on the services
              they use day to day. We’ve got thousands of suppliers ready and
              waiting to quote.
            </p>
          </div>
          <button className="mt-10 sm:mt-12 lg:mt-[72px] rounded-[5px] bg-[#00c3c0] px-6 py-[10px] text-white">
            Place a new request
          </button>
        </div>
      </div>
    </div>
  );
}
