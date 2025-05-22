'use client';
import React from 'react';
import SocialMediaLink from './social-media/SocialMediaLink';
import ExternalLinks from './social-media/ExternalLinks';

export default function SocialMediaLinks() {
  const onSave = () => console.log('Save clicked');
  const onCancel = () => console.log('Cancel clicked');
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex flex-col gap-3">
        <SocialMediaLink />
        {/* <ExternalLinks /> */}
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
    </div>
  );
}
