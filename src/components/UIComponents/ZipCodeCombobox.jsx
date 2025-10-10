'use client';

import React, { useState, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { ChevronDown, Check, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetZipCodeListQuery } from '@/store/features/public/publicApiService';

// API hook import

const ZipCodeCombobox = ({
  name,
  label,
  placeholder,
  disabled = false,
  onSelect,
}) => {
  const { control } = useFormContext();
  const [query, setQuery] = useState('');

  // ✅ watch selected country from form
  const selectedCountry = useWatch({ control, name: 'country' });

  const { data, isLoading } = useGetZipCodeListQuery(
    {
      page: 1,
      limit: 10,
      search: query,
      countryId: selectedCountry,
    },
    { skip: !selectedCountry }
  );

  // ✅ transform API data → options
  const options = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((z) => ({
      value: z._id,
      label: `${z.zipcode}`, // adjust based on API response
    }));
  }, [data]);

  const isDisabled = disabled || !selectedCountry;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{label}</label>
          <Combobox
            value={field.value ?? ''}
            onChange={(val) => {
              field.onChange(val);
              if (onSelect) onSelect(val);
            }}
            disabled={isDisabled}
          >
            <div className="relative">
              <ComboboxInput
                autoComplete="off"
                className="w-full h-11 text-black bg-white border border-[#dce2ea] rounded-lg px-4  text-sm font-medium leading-[27px] placeholder:text-[12px] placeholder:font-normal"
                displayValue={(val) =>
                  options.find((o) => o.value === val)?.label || ''
                }
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)} // live search
              />
              <ComboboxButton className="absolute top-0 bottom-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-4 w-4" />
              </ComboboxButton>

              <ComboboxOptions
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md 
             bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 
             focus:outline-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 p-2 text-gray-500">
                    <Loader className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : options && options.length > 0 ? (
                  options.map((item) => (
                    <ComboboxOption
                      key={item.value}
                      value={item.value}
                      className={({ active }) =>
                        cn(
                          'cursor-pointer select-none relative py-2 pl-10 pr-4',
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
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
                            {item.label}
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
                  <div className="p-2 text-gray-500 text-center">
                    No zip codes found
                  </div>
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
          {fieldState.error && (
            <div className="text-red-600 text-sm mt-1">
              {fieldState.error.message}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default ZipCodeCombobox;
