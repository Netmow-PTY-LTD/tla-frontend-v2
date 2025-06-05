'use client';

import TextInput from '@/components/form/TextInput';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import React from 'react';

export default function CompanyProfile() {
  return (
    <div>
      <h3 className="text-black font-semibold heading-lg">
        Company name & logo
      </h3>
      <div className="text-[#8E8E8E] mt-[10px]">
        This is the first thing customers will see when searching for a
        professional. As a sole-trader, you can just enter your name.
      </div>

      <div>
        <div className="mt-11">
          <AvatarUploader name="companyLogo" label="Upload Logo" />
        </div>

        <div className="mt-[30px]">
          <TextInput
            name={'companyName'}
            label={'Company Name'}
            placeholder={'Enter Your Company Name'}
          />
        </div>
      </div>
    </div>
  );
}
