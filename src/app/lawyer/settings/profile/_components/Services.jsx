import React from 'react';
import ServicesList from './services/ServicesList';

export default function Services() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-black font-semibold">Services</h2>

          <p className="mt-[10px]">
            Include all services you offer in some detail to give customers the
            confidence they’re looking for when making a hiring decision.
          </p>
        </div>
        <button className=" py-[10px] px-5 text-sm text-white rounded-md bg-[#12C7C4CC]">
          + Add Service
        </button>
      </div>
      <ServicesList />
    </div>
  );
}
