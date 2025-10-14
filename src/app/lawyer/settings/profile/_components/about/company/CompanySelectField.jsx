'use client';

import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';

const CompanySelectField = ({
  name,
  allCompanies,
  label = 'Select Company',
  query,
  isLoading,
  setQuery,
}) => {
  const dispatch = useDispatch();
  const { control } = useFormContext();
  // const [query, setQuery] = useState('');

  console.log('All Companies:', allCompanies);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selectedCompany = allCompanies?.find(
          (c) => c._id === field.value
        );

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Combobox
              value={field.value || ''}
              onChange={(val) => {
                field.onChange(val);

                const company = allCompanies?.find((c) => c._id === val);
              }}
            >
              <div className="relative">
                <ComboboxInput
                  className="border border-gray-300 rounded-md w-full h-[44px] px-4"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(val) =>
                    allCompanies?.find((c) => c._id === val)?.firmName || ''
                  }
                  placeholder="Select a company"
                />
                <ComboboxButton className="absolute top-0 bottom-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </ComboboxButton>
                {query.length >= 3 ? (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {allCompanies?.length > 0 ? (
                      allCompanies.slice(0, 10).map((company) => (
                        <ComboboxOption
                          key={company._id}
                          value={company._id}
                          className={({ active }) =>
                            cn(
                              'cursor-pointer select-none relative py-2 pl-10 pr-4',
                              active
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-900'
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={cn('block truncate', {
                                  'font-medium': selected,
                                  'font-normal': !selected,
                                })}
                              >
                                {company.firmName}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <Check className="h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </ComboboxOption>
                      ))
                    ) : (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-500 text-center">
                        No company found
                      </div>
                    )}
                  </ComboboxOptions>
                ) : null}
              </div>
            </Combobox>
            <FormMessage className="text-red-600" />
          </FormItem>
        );
      }}
    />
  );
};

export default CompanySelectField;
