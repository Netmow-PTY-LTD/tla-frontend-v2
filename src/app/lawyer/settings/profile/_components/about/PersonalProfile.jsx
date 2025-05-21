'use client';
import TextInput from '@/components/form/TextInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form } from '@/components/ui/form';
import FileUploader from '@/components/UIComponents/fileUploader';
import { Camera } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function PersonalProfile() {
  const form = useForm();
  return (
    <div>
      <h2 className="16px text-black font-semibold">
        Name and profile picture
      </h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        This is the person who will be communicating with customers on Bark. The
        photo will appear alongside your messages with customers.
      </p>

      <Form {...form}>
        <div className="flex items-center gap-3 mt-11">
          <Avatar className="h-[90px] w-[90px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <FileUploader
            label="Upload Photo"
            onChange={(e) => console.log(e.target.files)}
            accept="image/*"
            multiple={false}
          />
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
            control={form.control}
            name={'name'}
            label={'Name'}
            placeholder={'Enter Your  Name'}
          />
        </div>
      </Form>
    </div>
  );
}
