'use client';

import TextInput from '@/components/form/TextInput';

import { Modal } from '@/components/UIComponents/Modal';
import { CloudUpload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function VideoGallery() {
  const { setValue, resetField, register, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  // Manually register the videos field
  useEffect(() => {
    register('videos');
  }, [register]);

  const onSave = () => {
    const videoLink = watch('videos');
    console.log('🎥 YouTube Link:', videoLink);
    setOpen(false);
  };

  const onCancel = () => {
    resetField('videos');
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
            name="videos"
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
        {/* show embaded video under this  */}
      </div>
    </div>
  );
}
