'use client';

import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import React from 'react';

export default function PhotoGallery() {
  return (
    <div>
      <h3 className="16px text-black font-semibold heading-lg">Photos</h3>
      <p className="text-[#8E8E8E] mt-[10px]">
        Showcase what your business can do – for certain services, photos are
        often what customers look for first – previous projects, locations and
        venues, or before and after shots for example.
      </p>

      <div className="mt-11">
        <AvatarUploader name="photo" label="Upload Photos" />
      </div>
    </div>
  );
}
