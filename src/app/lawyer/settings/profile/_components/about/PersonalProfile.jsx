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
      <p className="text-[#6e6e6e] mt-2">
        This identifies the individual who will be communicating with clients on
        TheLawApp. Your name and photo will appear alongside messages, helping
        build a personal connection and trust with potential clients.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-8">
        <div className="w-full md:w-1/2">
          <AvatarUploader name="userProfileLogo" />
        </div>

        <div className="w-full md:w-1/2 space-y-5">
          <TextInput
            name="name"
            label="Name"
            placeholder="Enter Your Name"
            textColor="text-[#4b4949]"
          />
          <TextInput
            name="designation"
            label="Designation"
            placeholder="Enter Your Designation"
            textColor="text-[#4b4949]"
          />
        </div>
      </div>
    </div>
  );
}
