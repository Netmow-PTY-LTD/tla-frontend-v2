import React from 'react';
import PhotoGallery from './media/PhotoGallery';
import VideoGallery from './media/VideoGallery';

export default function Photos() {
  return (
    <div>
      <h2 className="font-bold text-lg">Photos</h2>
      <div className="flex flex-col gap-3">
        <PhotoGallery />
        <VideoGallery />
      </div>
    </div>
  );
}
