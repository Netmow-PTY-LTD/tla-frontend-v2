'use client';

import TextInput from '@/components/form/TextInput';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import React from 'react';

export default function CompanyProfile() {
  return (
    <div className="py-5 w-full">
      <h3 className="text-black font-semibold heading-lg">
        Company Information
      </h3>
      <p className="text-[#8E8E8E] mt-2">
        This is the first thing customers will see when searching for a
        professional. As a sole-trader, you can just enter your name.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mt-8">
        <div className="w-full md:w-1/2">
          <AvatarUploader name="companyLogo" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <TextInput
            name="companyName"
            label="Name"
            placeholder="Enter Your Company Name"
          />
          <TextInput
            name="contactEmail"
            label="Email Address"
            placeholder="netmow@gmail.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <TextInput
          name="phoneNumber"
          label="Phone Number"
          placeholder="+8801XXXXXXX"
        />
        <TextInput
          name="website"
          label="Website"
          placeholder="Company Website"
        />
      </div>
    </div>
  );
}
