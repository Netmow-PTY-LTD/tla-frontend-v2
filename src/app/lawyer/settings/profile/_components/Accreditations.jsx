'use client';

import React from 'react';
import AddAccreditationsModal from './accreditations/AddAccreditationsModal';
import AccreditationsList from './accreditations/AccreditationsList';
import { CircleAlert } from 'lucide-react';
import ToggleSwitch from '@/components/UIComponents/ToggleSwitch';

export default function Accreditations() {
  const handleToggle = (checked) => {
    console.log('Switch is now:', checked);
  };
  const onSave = () => console.log('Save clicked');
  const onCancel = () => console.log('Cancel clicked');

  return (
    <div className="max-w-[900px]">
      <div>
        <div className="flex items-center justify-between gap-5">
          <div>
            <h2 className="text-base font-semibold text-black">
              Accreditations
            </h2>
            <p className="text-sm text-[#8E8E8E] mt-2">
              Increase your chances of getting hired and boost customer
              confidence by adding your accreditations.
            </p>
          </div>
          <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
            <CircleAlert className="w-4 h-4" />
            <span>Optional</span>
            <ToggleSwitch onToggle={handleToggle} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <AccreditationsList />
          <AddAccreditationsModal />
        </div>
      </div>
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
