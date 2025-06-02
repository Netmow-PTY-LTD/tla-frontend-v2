'use client';
import React from 'react';
import PhotoGallery from './media/PhotoGallery';
import VideoGallery from './media/VideoGallery';
import FormWrapper from '@/components/form/FromWrapper';

export default function Photos() {
  const onCancel = () => console.log('Cancel clicked');
  const handlePhotoUpload = (data) => {
    console.log('Photo upload data:', data);
    // Handle the photo upload logic here
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <FormWrapper onSubmit={handlePhotoUpload}>
        <div className="flex flex-col gap-3">
          <PhotoGallery />
          <VideoGallery />
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
            type="submit"
            className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
          >
            Save
          </button>
        </div>
      </FormWrapper>
    </div>
  );
}
