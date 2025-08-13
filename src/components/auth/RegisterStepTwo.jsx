// Complete working version of RegisterStepTwoTest

import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetRangeListQuery,
  useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import {
  updateNestedField,
  nextStep,
  prevStep,
} from '@/store/features/auth/lawyerRegistrationSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { lawyerRegistrationStepTwoFormValidation } from '@/schema/auth/lawyerRegistration.schema';
import Link from 'next/link';
import { showErrorToast } from '../common/toasts';
import { Input } from '../ui/input';
import country from '@/data/au.json';

export default function RegisterStepTwo() {
  const [zipcode, setZipcode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [query, setQuery] = useState('');

  const dispatch = useDispatch();

  const lawyerServiceMap = useSelector(
    (state) => state.lawyerRegistration.lawyerServiceMap
  );

  const { zipCode, rangeInKm, practiceWithin, practiceInternationally } =
    lawyerServiceMap;

  const { data: zipcodeData } = useGetZipCodeListQuery();

  const { data: rangeData } = useGetRangeListQuery({
    zipcodeId: zipCode || '',
  });

  const ranges = rangeData?.data || [];

  const form = useForm({
    resolver: zodResolver(lawyerRegistrationStepTwoFormValidation),
    defaultValues: {
      practiceWithin: true,
      practiceInternational: practiceInternationally || false,
      AreaZipcode: '',
      rangeInKm: rangeInKm || '',
    },
  });

  const practiceWithinWatch = form.watch('practiceWithin');
  //const practiceInternationalWatch = form.watch('practiceInternational');

  //google map data
  const { watch, setValue } = form;
  const address = watch('AreaZipcode');

  useEffect(() => {
    let autocomplete;

    const initAutocomplete = () => {
      const input = document.getElementById('AreaZipcode');
      if (!input) return;

      autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ['geometry', 'formatted_address', 'address_components'],
      });

      // Restrict search to Australia
      autocomplete.setComponentRestrictions({
        country: ['au'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        // ✅ Extract ZIP code
        const postalCodeObj = place.address_components.find((c) =>
          c.types.includes('postal_code')
        );
        const zipCode = postalCodeObj ? postalCodeObj.long_name : '';

        if (!zipCode) return;

        // ✅ Update the form field "AreaZipcode"
        //setValue('zipcode', zipCode);

        // (Optional) Update other location fields too
        setValue('AreaZipcode', place.formatted_address);
      });
    };

    if (typeof window !== 'undefined') {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
      } else {
        window.initMap = initAutocomplete;
      }
    }
  }, [setValue]);

  // Still keep geocode fetch in case address changes without using autocomplete
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!address) return;

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();

        //console.log('data from geocode', data);

        if (data.status === 'OK') {
          const coords = data.results[0].geometry.location;

          setLatitude(coords.lat);
          setLongitude(coords.lng);

          const formattedAddress = data.results[0].formatted_address;

          // Extract ZIP code
          const postalCodeObj = data.results[0].address_components.find(
            (component) => component.types.includes('postal_code')
          );
          const zipCode = postalCodeObj ? postalCodeObj.long_name : '';

          setPostalCode(zipCode);
          // ✅ Prevent null in autocomplete
          setValue('AreaZipcode', formattedAddress);
          setZipcode(formattedAddress);
          //console.log('Zip code:', zipCode);
        }
      } catch (err) {
        console.error('Failed to fetch coordinates', err);
      }
    };

    fetchCoordinates();
  }, [address, setValue]);

  // console.log('zipCode', zipcode);
  // console.log('latitude', latitude);
  // console.log('longitude', longitude);

  const addressInfo = {
    countryId: country.countryId,
    countryCode: country.code.toLowerCase(),
    zipcode,
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    postalCode,
  };

  const onSubmit = (data) => {
    if (!practiceWithinWatch && (!data.AreaZipcode || !data.rangeInKm)) {
      showErrorToast('Please select at least one practice option.');
      return;
    }

    dispatch(
      updateNestedField({
        section: 'lawyerServiceMap',
        field: 'practiceWithin',
        value: data.practiceWithin,
      })
    );

    dispatch(
      updateNestedField({
        section: 'lawyerServiceMap',
        field: 'practiceInternationally',
        value: data.practiceInternational,
      })
    );

    dispatch(
      updateNestedField({
        section: 'lawyerServiceMap',
        field: 'zipCode',
        value: data.AreaZipcode,
      })
    );

    dispatch(
      updateNestedField({
        section: 'lawyerServiceMap',
        field: 'rangeInKm',
        value: data.rangeInKm,
      })
    );

    dispatch(
      updateNestedField({
        section: 'lawyerServiceMap',
        field: 'addressInfo',
        value: addressInfo,
      })
    );

    dispatch(nextStep());
  };

  const filteredZipcodes = zipcodeData?.data?.filter((item) =>
    item?.zipcode?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-wrap lg:flex-nowrap w-full">
      <div className="w-full">
        <div className="tla-auth-form tla-auth-form-register relative">
          <div className="absolute inset-0 flex items-center justify-center z-[-1]">
            <div className="w-[215px] h-[215px] rounded-full bg-[#00C3C080] blur-[100px]"></div>
          </div>
          <h3 className="tla-auth-title mb-2 text-center">
            Where would you like to see cases from?
          </h3>
          <p className="tla-auth-subtitle mb-10 text-center">
            Tell us the area you cover so we can show you cases for your
            location.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="practiceWithin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="ml-2 font-bold">
                      I will practice within
                    </FormLabel>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="AreaZipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Zipcode</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter area zipcode"
                        id="AreaZipcode"
                        className="tla-form-control"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="rangeInKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Range of Area</FormLabel>
                    <Select
                      disabled={!zipCode} // disable if no zipcode selected
                      onValueChange={(val) => {
                        field.onChange(val); // update form
                        dispatch(
                          updateNestedField({
                            section: 'lawyerServiceMap',
                            field: 'rangeInKm',
                            value: val, // store _id in Redux
                          })
                        );
                      }}
                      value={field.value} // current selected _id
                    >
                      <FormControl className="tla-form-control">
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select range of area"
                            renderValue={(selectedId) => {
                              const selectedItem = ranges?.find(
                                (item) => item._id === selectedId
                              );
                              return selectedItem
                                ? `${selectedItem.value} ${selectedItem.unit}`
                                : '';
                            }}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ranges?.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.value} {item.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="rangeInKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Range of Area</FormLabel>
                    <Select
                      //disabled={!practiceWithinWatch || !zipCode} // disable if no zipcode selected
                      onValueChange={(val) => {
                        const parsedValue = Number(val); // convert from string to number
                        field.onChange(parsedValue); // update form
                        dispatch(
                          updateNestedField({
                            section: 'lawyerServiceMap',
                            field: 'rangeInKm',
                            value: parsedValue, // store number in Redux
                          })
                        );
                      }}
                      value={String(field.value)} // must be string for Select
                    >
                      <FormControl className="tla-form-control">
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select range of area"
                            // render={(selectedValue) => {
                            //   const selectedItem = ranges?.find(
                            //     (item) => String(item.value) === selectedValue
                            //   );
                            //   return selectedItem?.label || '';
                            // }}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ranges?.map((item) => {
                          return (
                            <SelectItem
                              key={item.value}
                              value={String(item.value)}
                            >
                              {item.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="practiceInternational"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="ml-2 font-bold">
                      I will practice internationally all over the world
                    </FormLabel>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M10.9082 17.5C9.42487 17.5 7.97479 17.0602 6.74143 16.236C5.50806 15.4119 4.54677 14.2406 3.97911 12.8702C3.41145 11.4997 3.26293 9.99167 3.55232 8.53683C3.8417 7.08197 4.55601 5.7456 5.6049 4.6967C6.6538 3.64781 7.99017 2.9335 9.44504 2.64412C10.8999 2.35472 12.4079 2.50325 13.7784 3.07091C15.1488 3.63857 16.3201 4.59986 17.1442 5.83322C17.9684 7.06659 18.4082 8.51667 18.4082 10C18.4082 11.9892 17.618 13.8968 16.2115 15.3033C14.805 16.7098 12.8974 17.5 10.9082 17.5ZM10.9082 3.75C9.67204 3.75 8.4637 4.11656 7.43589 4.80332C6.40809 5.49007 5.607 6.46619 5.13396 7.60823C4.66091 8.75025 4.53714 10.0069 4.77829 11.2193C5.01945 12.4317 5.61471 13.5453 6.48879 14.4194C7.36287 15.2935 8.47651 15.8887 9.68887 16.1299C10.9013 16.3711 12.158 16.2473 13.3 15.7743C14.442 15.3012 15.4181 14.5001 16.1049 13.4723C16.7916 12.4445 17.1582 11.2362 17.1582 10C17.1582 8.34242 16.4997 6.75269 15.3276 5.58058C14.1555 4.40848 12.5658 3.75 10.9082 3.75Z"
                    fill="#0B1C2D"
                  />
                  <path
                    d="M10.9082 10.8333C10.7431 10.8311 10.5854 10.7646 10.4686 10.6479C10.3519 10.5311 10.2854 10.3734 10.2832 10.2083V7.29163C10.2832 7.12587 10.349 6.96689 10.4663 6.84968C10.5835 6.73248 10.7425 6.66663 10.9082 6.66663C11.074 6.66663 11.233 6.73248 11.3501 6.84968C11.4674 6.96689 11.5332 7.12587 11.5332 7.29163V10.2083C11.531 10.3734 11.4645 10.5311 11.3478 10.6479C11.231 10.7646 11.0733 10.8311 10.9082 10.8333Z"
                    fill="#0B1C2D"
                  />
                  <path
                    d="M10.9082 13.3333C10.7431 13.3311 10.5854 13.2646 10.4686 13.1479C10.3519 13.0311 10.2854 12.8734 10.2832 12.7083V12.2916C10.2832 12.1259 10.349 11.9669 10.4663 11.8497C10.5835 11.7325 10.7425 11.6666 10.9082 11.6666C11.074 11.6666 11.233 11.7325 11.3501 11.8497C11.4674 11.9669 11.5332 12.1259 11.5332 12.2916V12.7083C11.531 12.8734 11.4645 13.0311 11.3478 13.1479C11.231 13.2646 11.0733 13.3311 10.9082 13.3333Z"
                    fill="#0B1C2D"
                  />
                </svg>
                <span className="text-[var(--color-black)]">
                  You can change your location at any time
                </span>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="btn-default btn-outline-black"
                  onClick={() => dispatch(prevStep())}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-default bg-[var(--color-special)]"
                >
                  Next
                </button>
              </div>
            </form>
          </Form>
          <div className="tla-auth-footer text-center">
            <span>Already have an account? </span>
            <Link href="/login">
              <b>Log In</b>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="hidden lg:block lg:max-w-[31.25rem]">
        <Image
          src="/assets/img/register.webp"
          width={600}
          height={627}
          alt="Auth Image"
          className='h-full object-cover rounded-tl-0 rounded-tr-[1.25rem] rounded-br-[1.125rem] rounded-bl-0"'
        />
      </div> */}
    </div>
  );
}
