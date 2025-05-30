'use client';

import TextInput from '@/components/form/TextInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import FileUploader from '@/components/UIComponents/fileUploader';
import { CloudUpload } from 'lucide-react';
import React from 'react';

export default function CompanyProfile() {
  return (
    <div>
      <h2 className="16px text-black font-semibold">Company name & logo</h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        This is the first thing customers will see when searching for a
        professional. As a sole-trader, you can just enter your name.
      </p>

      <div>
        {/* <div className="flex items-center gap-3 mt-11">
          <Avatar className="h-[90px] w-[90px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <FileUploader
            label="Upload Photo"
            onChange={(e) => console.log(e.target.files)}
            accept="image/*"
            multiple={false}
            icon={<CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />}
          />
        </div> */}
        <AvatarUploader name="companyLogo" label="Upload Logo" />
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
