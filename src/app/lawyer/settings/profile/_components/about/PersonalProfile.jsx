'use client';
import TextInput from '@/components/form/TextInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import FileUploader from '@/components/UIComponents/fileUploader';
import { Camera, CloudUpload } from 'lucide-react';
import React from 'react';

export default function PersonalProfile() {
  return (
    <div className="max-w-xl w-full">
      <h3 className="text-black font-semibold heading-lg">
        Name and profile picture
      </h3>
      <p className="text-[#8E8E8E] mt-2">
        This is the person who will be communicating with customers on Bark. The
        photo will appear alongside your messages with customers.
      </p>

      <div className="mt-8">
        <AvatarUploader name="userProfileLogo" />
      </div>

      <div className="mt-8 space-y-5">
        <TextInput name="name" label="Name" placeholder="Enter Your Name" />
        <TextInput
          name="designation"
          label="Designation"
          placeholder="Enter Your Designation"
        />
      </div>
    </div>
  );
}
