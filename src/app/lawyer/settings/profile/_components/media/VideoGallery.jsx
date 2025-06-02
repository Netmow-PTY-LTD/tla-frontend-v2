'use client';

import TextInput from '@/components/form/TextInput';

import { Modal } from '@/components/UIComponents/Modal';
import { CloudUpload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function VideoGallery() {
  const { resetField, register, watch, getValues } = useFormContext();
  const [open, setOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  console.log('get values', getValues('video'));
  // Extract YouTube Video ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match?.[1] ?? null;
  };
  // Manually register the videos field
  useEffect(() => {
    register('video');

    const defaultVideo = getValues('video'); // ✅ fetch default value from form
    const videoId = extractYouTubeId(defaultVideo);
    if (videoId) {
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
    }
  }, [getValues, register]);

  const onSave = () => {
    const videoLink = watch('video');

    if (!videoLink || typeof videoLink !== 'string') {
      console.warn('⚠️ Video link is empty or invalid');
      setEmbedUrl('');
      setOpen(false);
      return;
    }

    const videoId = extractYouTubeId(videoLink);

    if (videoId) {
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
    } else {
      setEmbedUrl('');
      console.warn('⚠️ Invalid YouTube URL format');
    }

    setOpen(false);
  };

  const onCancel = () => {
    resetField('video');
    setOpen(false);
  };
  return (
    <div>
      <h2 className="16px text-black font-semibold">Videos</h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        Add YouTube videos to showcase your work and expertise – videos of
        previous events for example.
      </p>

      <div className="flex items-center gap-3 mt-11">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full  px-5 py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer text-center hover:bg-gray-50 transition`}
          onClick={() => setOpen(true)}
        >
          <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
        </label>

        <Modal open={open} onOpenChange={setOpen} title={'Add YouTube link'}>
          <TextInput
            label={'YouTube Link'}
            name="video"
            placeholder="https://www.youtube.com/watch?v=example"
            className="w-full"
          />
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
              Add Link
            </button>
          </div>
        </Modal>
        {/* Embedded video preview */}
        {embedUrl && (
          <div className="mt-6 w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="Embedded YouTube Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}
