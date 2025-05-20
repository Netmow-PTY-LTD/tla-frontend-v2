'use client';
import TextInput from '@/components/form/TextInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form } from '@/components/ui/form';
import FileUploader from '@/components/UIComponents/fileUploader';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function CompanyProfile() {
  const form = useForm();
  return (
    <div>
      <h2 className="16px text-black font-semibold">Company name & logo</h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        This is the first thing customers will see when searching for a
        professional. As a sole-trader, you can just enter your name.
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
        </div>
        <div className="mt-[30px]">
          <TextInput
            control={form.control}
            name={'name'}
            label={'Name'}
            placeholder={'Enter Your Company Name'}
          />
        </div>
      </Form>
    </div>
  );
}
