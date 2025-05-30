'use client';
import SelectInput from '@/components/form/SelectInput';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import DropdownMenuSelect from '@/components/UIComponents/DropDwonMenuSelect';
import React from 'react';

export default function CompanyAbout() {
  const options = [
    {
      label: 'Self-employed / Sole Trader',
      value: 'self_employed',
    },
    {
      label: '2–10 Employees',
      value: '2_10_employees',
    },
    {
      label: '11–50 Employees',
      value: '11_50_employees',
    },
    {
      label: '51–200 Employees',
      value: '51_200_employees',
    },
    {
      label: 'Over 200 Employees',
      value: 'over_200_employees',
    },
  ];

  return (
    <div className="py-9">
      <h2 className="text-black font-semibold">About the company</h2>
      <p className="mt-[10px] mb-7">Introduce the company to your customers.</p>

      <div>
        <div className="grid grid-cols-2 gap-x-20 gap-y-7">
          {/* <DropdownMenuSelect
            triggerLabel="Company Size"
            dropdownLabel="Choose Company Size"
            options={options}
            onSelect={handleSelect}
            defaultValue="Self-employed / Sole Trader"
          /> */}
          <SelectInput
            label={'Choose Company Size'}
            name={'companySize'}
            options={options}
            placeholder="Select company size"
            defaultValue="Self-employed / Sole Trader"
          />

          <TextInput
            label="Years in business"
            name="yearsInBusiness"
            placeholder="Number of years"
          />
          <TextareaInput
            label="Describe your company "
            name="description"
            placeholder="What sets you apart from businesses?"
          />
        </div>
      </div>
    </div>
  );
}
