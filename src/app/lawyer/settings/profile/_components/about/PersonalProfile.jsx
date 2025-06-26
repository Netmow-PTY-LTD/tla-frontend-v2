'use client';
import TextInput from '@/components/form/TextInput';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';

import React from 'react';

export default function PersonalProfile() {
  return (
    <div className="w-full">
      <h3 className="text-black font-semibold heading-lg">
        Personal Information
      </h3>
      <p className="text-[#8E8E8E] mt-2">
        This is the person who will be communicating with customers on Bark. The
        photo will appear alongside your messages with customers.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-8">
        <div className="w-full md:w-1/2">
          <AvatarUploader name="userProfileLogo" />
        </div>

        <div className="w-full md:w-1/2 space-y-5">
          <TextInput name="name" label="Name" placeholder="Enter Your Name" />
          <TextInput
            name="designation"
            label="Designation"
            placeholder="Enter Your Designation"
          />
        </div>
      </div>
    </div>
  );
}
