'use client';

import ServicesList from './services/ServicesList';
import ServiceAddModal from './services/ServiceAddModal';

export default function Services() {
  const onSave = () => console.log('Save clicked');
  const onCancel = () => console.log('Save clicked');

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-black font-semibold">Services</h2>

          <p className="mt-[10px]">
            Include all services you offer in some detail to give customers the
            confidence they’re looking for when making a hiring decision.
          </p>
        </div>

        {/*  Services modal */}
        <ServiceAddModal />
      </div>
      <ServicesList />

      {/* Footer Buttons */}
      <div className="flex justify-between items-center pt-4 ">
        <button
          onClick={onCancel}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
        >
          Save
        </button>
      </div>
    </div>
  );
}
