'use client';

import TextInput from '@/components/form/TextInput';
import Link from 'next/link';
import React from 'react';

export default function CompanyContactDetails() {
  return (
    <div className="py-9">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7">
          <TextInput
            label="Email Address"
            name="contactEmail"
            placeholder="netmow@gmail.com"
          />
          <TextInput
            label="Phone Number"
            name="phoneNumber"
            placeholder="XXXXXXXXX"
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
