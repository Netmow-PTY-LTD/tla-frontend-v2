'use client';

import TextInput from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function CompanyContactDetails() {
  const form = useForm();
  return (
    <div className="py-9">
      <h2 className="text-black font-semibold">Company contact details</h2>
      <p className="mt-[10px] mb-7">
        This information will be seen by customers on Bark. Change the details
        Bark uses to contact you privately in {' '}
        <Link
          href="/lawyer/settings/profile"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Account Details
        </Link>
        .
      </p>

      <Form {...form}>
        <div className="grid grid-cols-2 gap-x-20 gap-y-7">
          <TextInput
            control={form.control}
            label="Company Email Address"
            name="companyEmail"
            placeholder="netmow@gmail.com"
          />
          <TextInput
            control={form.control}
            label="Company Phone Number"
            name="companyPhone"
            placeholder="+8801XXXXXXX"
          />
          <TextInput
            control={form.control}
            label="Website"
            name="website-link"
            placeholder="Company Website"
          />
        </div>
      </Form>
    </div>
  );
}
