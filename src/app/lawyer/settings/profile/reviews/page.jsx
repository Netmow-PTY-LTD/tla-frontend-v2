'use client';

import React from 'react';
import AppReview from './_components/AppReview';
import OverAllRating from './_components/OverAllRating';

export default function Review() {
  const onSave = () => console.log('Save clicked');
  const onCancel = () => console.log('Cancel clicked');
  return (
    <div className="max-w-[900px] mx-auto">
      {/* overall rating */}
      <OverAllRating />

      <div className="border-t border-white my-5" />
      {/*  lazy app review */}
      <AppReview />

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
