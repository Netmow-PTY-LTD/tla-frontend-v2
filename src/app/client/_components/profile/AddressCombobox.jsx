
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useGetZipCodeListQuery } from '@/store/features/public/publicApiService';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import React, { useState} from 'react';
import { useFormContext } from 'react-hook-form';

export default function AddressCombobox() {
  const { control } = useFormContext();
  const { data: zipcodeData } = useGetZipCodeListQuery();
  const [query, setQuery] = useState('');
  const [selectedZipcode, setSelectedZipcode] = useState(null);

  // Filter zipcodes based on query
  const filteredZipcodes = zipcodeData?.data?.filter((item) =>
    item.zipcode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <FormField
      control={control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <Combobox
            value={selectedZipcode || field.value}
            onChange={(val) => {
              setSelectedZipcode(val);
              field.onChange(val);

            }}
          >
            <div className="relative">
              <ComboboxInput
                className="tla-form-control w-full"
                onChange={(e) => setQuery(e.target.value)}
                displayValue={(val) =>
                  zipcodeData?.data?.find((z) => z.zipcode === val)?.zipcode || ''
                }
                placeholder="Select an Address"
              />
          

              {filteredZipcodes?.length > 0 && (
                <ComboboxOptions  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {filteredZipcodes.slice(0, 10).map((item) => (
                    <ComboboxOption
                      key={item._id}
                      value={item.zipcode}
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
                            {item.zipcode}
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
  );
}

