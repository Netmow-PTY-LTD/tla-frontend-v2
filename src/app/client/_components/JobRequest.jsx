import React from 'react';

const JobRequest = ({ modalOpen, setModalOpen }) => {
  return (
    <>
      <div className="bg-[#fff] rounded-[10px] h-full w-full py-10 px-6 sm:px-10 md:px-20 lg:px-[100px] xl:px-[180px] 2xl:px-[247px] relative overflow-hidden mt-10 max-w-[1100px] mx-auto">
        {/* Soft Glow Effect */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-[300px] h-[300px] rounded-full bg-[#00C3C080] blur-[120px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-[#2C2C2C]">
            Find services for your business on{' '}
            <span className="text-[#00c3c0]">The Law APP</span>
          </h2>
          <p className="mt-4 text-base text-gray-700 max-w-2xl">
            Most businesses could be getting a better deal on the services they
            use day to day. We’ve got thousands of suppliers ready and waiting
            to quote.
          </p>
          <button
            className="mt-10 sm:mt-12 lg:mt-[72px] rounded-[5px] bg-[#00c3c0] px-6 py-[10px] text-white hover:bg-[#00b5b2] transition-all"
            onClick={() => setModalOpen(true)}
          >
            Place a new request
          </button>
        </div>
      </div>
    </>
  );
};

export default JobRequest;
