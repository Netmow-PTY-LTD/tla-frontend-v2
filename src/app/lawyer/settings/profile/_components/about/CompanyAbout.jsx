'use client';

import TextArea from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function CompanyAbout() {
  const form = useForm();
  return (
    <div className="py-9">
      <h2 className="text-black font-semibold">About the company</h2>
      <p className="mt-[10px] mb-7">Introduce the company to your customers.</p>

      <Form {...form}>
        <div className="grid grid-cols-2 gap-x-20 gap-y-7">
          <TextInput
            control={form.control}
            label="Years in business"
            name="yer"
            placeholder="Number of years"
          />

          <TextInput
            control={form.control}
            label="Years in business"
            name="yer"
            placeholder="Number of years"
          />
          <TextArea
            control={form.control}
            label="Describe your company "
            name="description"
            placeholder="What sets you apart from businesses?"
          />
        </div>
      </Form>
    </div>
  );
}
