'use client';

import React, { useState, useMemo } from 'react';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';


export default function CountrySelect({ form, name }) {
  const { data: countryList } = useGetCountryListQuery();
  const [query, setQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!query) return countryList?.data || [];
    return countryList?.data.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, countryList]);

  return (
    <div className="w-full">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Country</FormLabel>
            <Combobox
              value={field.value}
            //   onChange={(val) => field.onChange(val)}
            onChange={(selectedId) => {
                field.onChange(selectedId);

                // find selected country object
                const selectedCountry = countryList?.data?.find(
                  (c) => c._id === selectedId
                );

                if (selectedCountry) {
                  // auto-set countryCode = slug
                  form.setValue('countryCode', selectedCountry.slug);
                }
              }}
            >
              <div className="relative">
                <ComboboxInput
                  className="border border-gray-300 rounded-md w-full h-[44px] px-4"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(val) => {
                    const found = countryList?.data?.find((c) => c._id === val);
                    return found?.name || '';
                  }}
                  placeholder="Select a Country"
                />
                <ComboboxButton className="absolute top-0 bottom-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </ComboboxButton>
                {filteredCountries?.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {filteredCountries.map((item) => (
                      <ComboboxOption
                        key={item._id}
                        value={item._id}
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
                              {item.name}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
            <FormMessage className="text-red-600" />
          </FormItem>
        )}
      />
    </div>
  );
}
