'use client';

import { Input } from '@/components/ui/input';
import { Modal } from '@/components/UIComponents/Modal';
import { getEmbedUrl } from '@/utils/embedVideoLink';
import { CloudUpload, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export default function VideoGallery() {
  const { control, watch, setValue, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'videos',
  });

  console.log('VideoGallery getValues:', getValues('videos'));
  const [open, setOpen] = useState(false);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const current = watch('videos');
    if (!Array.isArray(current)) {
      setValue('videos', []);
    }
  }, [setValue, watch]);

  const onSave = () => {
    console.log('Saving new video link:', newLink);
    if (!newLink) return;
    const embed = getEmbedUrl(newLink);
    if (embed) {
      append({ url: newLink });
      setNewLink('');
      setOpen(false);
    } else {
      console.warn('Invalid video link');
    }
  };

  const onCancel = () => {
    setNewLink('');
    setOpen(false);
  };

  return (
    <div className="mt-10">
      <h3 className="text-black font-semibold text-lg">Videos</h3>
      <p className="text-[#8E8E8E] mt-[10px]">
        Add YouTube videos to showcase your work and expertise – videos of
        previous events for example.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-11">
        {/* Video previews */}
        {fields?.map((field, index) => {
          const embed = getEmbedUrl(field.url);
          if (!embed) return null;

          return (
            <div
              key={field.id}
              className="relative group w-full aspect-video rounded-xl overflow-hidden shadow-lg"
            >
              <iframe
                width="100%"
                height="100%"
                src={embed}
                title={`Embedded Video ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow group-hover:opacity-100 opacity-0 transition"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          );
        })}

        {/* Add new video button */}
        <div className="w-full aspect-video">
          <label
            className="flex flex-col items-center justify-center w-full h-full px-5 py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer text-center hover:bg-gray-50 transition"
            onClick={() => setOpen(true)}
          >
            <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
            <span className="text-sm text-gray-500">Add Video Link</span>
          </label>
        </div>
      </div>

      {/* Modal for adding video link */}
      <Modal open={open} onOpenChange={setOpen} title="Add Video Link">
        <Input
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=example"
          className="w-full"
        />
        <div className="flex justify-between items-center pt-4">
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
    </div>
  );
}
