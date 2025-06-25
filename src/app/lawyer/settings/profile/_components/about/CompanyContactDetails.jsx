'use client';

import TextInput from '@/components/form/TextInput';
import Link from 'next/link';
import React from 'react';

export default function CompanyContactDetails() {
  return (
    <div className="py-9">
      <h3 className="text-black font-semibold heading-lg">
        Company contact details
      </h3>
      <p className="mt-[10px] text-[#8E8E8E] mb-7">
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

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7">
          <TextInput
            label="Company Email Address"
            name="contactEmail"
            placeholder="netmow@gmail.com"
          />
          <TextInput
            label="Company Phone Number"
            name="phoneNumber"
            placeholder="+8801XXXXXXX"
          />
          <TextInput
            label="Website"
            name="website"
            placeholder="Company Website"
          />
        </div>
      </div>
    </div>
  );
}
