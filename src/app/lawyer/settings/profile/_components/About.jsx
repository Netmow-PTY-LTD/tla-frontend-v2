'use client';

import React from 'react';
import CompanyProfile from './about/CompanyProfile';
import PersonalProfile from './about/PersonalProfile';
import CompanyContactDetails from './about/CompanyContactDetails';
import CompanyLocation from './about/CompanyLocation';
import CompanyAbout from './about/CompanyAbout';

export default function About() {
  const onSave = () => console.log('Save clicked');
  const onCancel = () => console.log('Cancel clicked');
  return (
    <div className="max-w-[900px]">
      <div className="flex items-center gap-20  mb-5 ">
        <CompanyProfile />
        <PersonalProfile />
      </div>
      <div className="border-t border-white" />
      <CompanyContactDetails />
      <div className="border-t border-white" />
      <CompanyLocation />
      <div className="border-t border-white" />
      <CompanyAbout />
      <div className="border-t border-white" />
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
