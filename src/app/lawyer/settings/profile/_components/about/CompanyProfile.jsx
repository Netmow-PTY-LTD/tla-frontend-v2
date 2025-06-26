'use client';

import TextInput from '@/components/form/TextInput';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import React from 'react';

export default function CompanyProfile() {
  return (
    <div className="max-w-xl w-full">
      <h3 className="text-black font-semibold heading-lg">
        Company name & logo
      </h3>
      <p className="text-[#8E8E8E] mt-2">
        This is the first thing customers will see when searching for a
        professional. As a sole-trader, you can just enter your name.
      </p>

      <div className="mt-8">
        <AvatarUploader name="companyLogo" />
      </div>

      <div className="mt-8">
        <TextInput
          name="companyName"
          label="Company Name"
          placeholder="Enter Your Company Name"
        />
      </div>
    </div>
  );
}
