'use client';
import SelectInput from '@/components/form/SelectInput';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';

import React from 'react';

export default function CompanyAbout({ companyInfo }) {
  console.log('companyInfo in CompanyAbout:', companyInfo);
  const options = [
    {
      label: 'Self-employed / sole trader',
      value: 'self_employed',
    },
    {
      label: '2–10 employees',
      value: '2_10_employees',
    },
    {
      label: '11–50 employees',
      value: '11_50_employees',
    },
    {
      label: '51–200 employees',
      value: '51_200_employees',
    },
    {
      label: 'Over 200 employees',
      value: 'over_200_employees',
    },
  ];

  return (
    <>
      <div className="py-9">
        <h3 className="text-black font-semibold heading-lg">
          About the company
        </h3>
        <p className="mt-[10px] text-[#6e6e6e] mb-7">
          Give potential clients a clear introduction to your law firm. Share
          your mission, areas of legal expertise, years of experience, and what
          sets your firm apart. This is your opportunity to build trust and make
          a strong first impression.
        </p>

        <div className="space-y-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7">
            <SelectInput
              label={'Choose Company Size'}
              name={'companySize'}
              options={options}
              placeholder="Select company size"
              defaultValue="Self-employed / Sole Trader"
              textColor="text-[#4b4949]"
              disabled
            />

            <TextInput
              label="Years in business"
              name="yearsInBusiness"
              placeholder="Number of years"
              textColor="text-[#4b4949]"
              disabled
            />
          </div>
          <div>
            <label htmlFor="" className="label-text text-sm">
              Company Description
            </label>
            {/* <TextareaInput
          label="Describe your company "
          name="description"
          placeholder="What sets you apart from businesses?"
          textColor="text-[#4b4949]"
          rows="8"
          disabled
        /> */}
            <div
              className="text-[#4b4949] text-sm mt-2 company-desc"
              dangerouslySetInnerHTML={{ __html: companyInfo?.description }}
            ></div>
          </div>
        </div>
      </div>
      <style>
        {`
        .company-desc :is(h1, h2, h3, h4, h5, h6, p, ul, ol, li) {
          margin: 1rem 0;
        }
        
         .company-desc h1 {
            font-size: 2.75rem; /* 44px */
            line-height: 3rem;
          }

          .company-desc h2 {
            font-size: 2rem; /* 32px */
            line-height: 2.25rem; /* 36px */
          }

         .company-desc h3 {
            font-size: 1.75rem; /* 28px */
            line-height: 2rem; /* 32px */
          }

         .company-desc h4 {
            font-size: 1.5rem; /* 24px */
            line-height: 1.75rem; /* 28px */
          }

          .company-desc h5 {
            font-size: 1.125rem; /* 18px */
            line-height: 1.375rem; /* 22px */
          }

          .company-desc h6 {
            font-size: 0.875rem; /* 32px */
            line-height: 1.375rem; /* 36px */
          }
      `}
      </style>
    </>
  );
}
