'use client';

import { Form } from '@/components/ui/form';
import FileUploader from '@/components/UIComponents/fileUploader';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function VideoGallery() {
  const form = useForm();
  return (
    <div>
      <h2 className="16px text-black font-semibold">Videos</h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        Add YouTube videos to showcase your work and expertise – videos of
        previous events for example.
      </p>

      <Form {...form}>
        <div className="flex items-center gap-3 mt-11">
          <FileUploader
            label="Photos you add to your profile will appear here."
            onChange={(e) => console.log(e.target.files)}
            accept="image/*"
            multiple={false}
          />
        </div>
      </Form>
      <div>
        <Image />
      </div>
    </div>
  );
}
