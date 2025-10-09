import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import { cn } from '@/lib/utils';
import {
  useGetCountryListQuery,
  useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import Cookies from 'js-cookie';
import { Check, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import countries from '@/data/countries.json';

export default function LocationCombobox({ setLocation, defaultLocation }) {
  const [query, setQuery] = useState('');
  const [selectedZipcodeId, setSelectedZipcodeId] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(query);
    }, 500); // wait 500ms after typing

    return () => clearTimeout(timeout); // cleanup on each keystroke
  }, [query]);

  const { data: countryList } = useGetCountryListQuery();

  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));

  const defaultCountry = countryList?.data?.find(
    (country) => country?._id === cookieCountry?.countryId
  );

  const paramsPayload = {
    countryId: defaultCountry?._id,
    search: debouncedSearch || '',
  };

  const { data: allZipCodes, isLoading: isZipCodeLoading } =
    useGetZipCodeListQuery(paramsPayload, {
      skip: !defaultCountry?._id || !debouncedSearch,
    });

  const selectedZipCode = allZipCodes?.data?.find(
    (z) => z._id === selectedZipcodeId
  );

  useEffect(() => {
    if (defaultLocation && !selectedZipCode) {
      setSelectedZipcodeId(defaultLocation._id);
      setLocation(defaultLocation);
    }
  }, [defaultLocation, selectedZipCode, setSelectedZipcodeId, setLocation]);

  return (
    <Combobox
      value={selectedZipCode?.zipcode || defaultLocation?.zipcode || ''}
      onChange={(val) => {
        setSelectedZipcodeId(
          allZipCodes?.data?.find((z) => z.zipcode === val)?._id
        );
        setLocation(
          allZipCodes?.data?.find((z) => z.zipcode === val) || defaultLocation
        );
      }}
    >
      <div className="relative">
        <ComboboxInput
          className="border border-gray-300 rounded-md w-full h-[44px] px-4"
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(val) => val || ''} // show either selected zipcode or defaultLocation
          placeholder="Select a location..."
          autoComplete="off"
        />

        {allZipCodes?.data?.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {allZipCodes?.data?.slice(0, 10).map((item) => (
              <ComboboxOption
                key={item._id}
                value={item.zipcode} // 👈 use zipcode as the value
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
  );
}
