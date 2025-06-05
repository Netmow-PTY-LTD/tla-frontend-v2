'use client';
import TextInput from '@/components/form/TextInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import FileUploader from '@/components/UIComponents/fileUploader';
import { Camera, CloudUpload } from 'lucide-react';
import React from 'react';

export default function PersonalProfile() {
  return (
    <div>
      <h3 className="16px text-black font-semibold heading-lg">
        Name and profile picture
      </h3>
      <div className="text-[#8E8E8E] mt-[10px]">
        This is the person who will be communicating with customers on Bark. The
        photo will appear alongside your messages with customers.
      </div>

      <div>
        <div className="flex items-center gap-3 mt-11">
          <AvatarUploader name="userProfileLogo" label="Upload Photo" />
          <div>
            <label
              htmlFor="open-camera"
              className={`flex flex-col items-center justify-center w-full  px-5 py-4 border border-dashed border-gray-300 rounded-2xl cursor-pointer text-center hover:bg-gray-50 transition`}
            >
              <Camera className="w-6 h-6 text-[#00C3C0] mb-2" />
            </label>
            <p className="text-gray-700 font-medium text-center mt-2">
              Open Camera
            </p>
          </div>
        </div>
        <div className="mt-[30px]">
          <TextInput
            name={'name'}
            label={'Name'}
            placeholder={'Enter Your  Name'}
          />
        </div>
      </div>
    </div>
  );
}
