'use client';

import { Form } from '@/components/ui/form';
import FileUploader from '@/components/UIComponents/fileUploader';
import { CloudUpload } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function PhotoGallery() {
  const form = useForm();
  return (
    <div>
      <h2 className="16px text-black font-semibold">Photos</h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        Showcase what your business can do – for certain services, photos are
        often what customers look for first – previous projects, locations and
        venues, or before and after shots for example.
      </p>

      <Form {...form}>
        <div className="flex items-center gap-3 mt-11">
          <FileUploader
            label="Photos you add to your profile will appear here."
            onChange={(e) => console.log(e.target.files)}
            accept="image/*"
            multiple={false}
            icon={<CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />}
          />
        </div>
      </Form>
      <div>{/* Image Gellary*/}</div>
    </div>
  );
}
