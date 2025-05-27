// Complete working version of RegisterStepTwoTest

import Image from 'next/image';
import React, { useState } from 'react';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { lawyerRegistrationStepTwoFormValidation } from '@/schema/auth/lawyerRegistration.schema';

export default function RegisterStepTwo() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');

  const lawyerServiceMap = useSelector(
    (state) => state.lawyerRegistration.lawyerServiceMap
  );

  const { zipCode, rangeInKm, practiceWithin, practiceInternationally } =
    lawyerServiceMap;

  const { data: zipcodeData } = useGetZipCodeListQuery();

  const { data: rangeData } = useGetRangeListQuery({
    zipcodeId: zipCode || '',
  });

  // const ranges = rangeData?.data || [];
  const ranges = [
    {
      label: '1 miles',
      value: 1,
    },
    {
      label: '2 miles',
      value: 2,
    },
    {
      label: '10 miles',
      value: 10,
    },
    {
      label: '20 miles',
      value: 20,
    },
    {
      label: '50 miles',
      value: 50,
    },
    {
      label: '75 miles',
      value: 75,
    },
    {
      label: '100 miles',
      value: 100,
    },
    {
      label: '125 miles',
      value: 125,
    },
    {
      label: '150 miles',
      value: 150,
    },
  ];

  const form = useForm({
    resolver: zodResolver(lawyerRegistrationStepTwoFormValidation),
    defaultValues: {
      practiceWithin: practiceWithin || false,
      practiceInternational: practiceInternationally || false,
      AreaZipcode: zipCode || '',
      rangeInKm: rangeInKm || '',
    },
  });

  const onSubmit = (data) => {
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
    dispatch(nextStep());
  };

  const filteredZipcodes = zipcodeData?.data?.filter((item) =>
    item?.zipcode?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-wrap lg:flex-nowrap">
      <div className="hidden lg:block lg:max-w-[602]">
        <Image
          src="/assets/img/auth-step2.png"
          width={600}
          height={751}
          alt="Auth Image"
        />
      </div>
      <div className="w-full lg:w-7/12">
        <div className="tla-auth-form tla-auth-form-register">
          <h2 className="tla-auth-title mb-2">
            Where would you like to see leads from?
          </h2>
          <p className="tla-auth-subtitle mb-5">
            Tell us the area you cover so we can show you leads for your
            location.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="AreaZipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Zipcode</FormLabel>
                    <Combobox
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        dispatch(
                          updateNestedField({
                            section: 'lawyerServiceMap',
                            field: 'zipCode',
                            value: val,
                          })
                        );
                      }}
                    >
                      <div className="relative">
                        <ComboboxInput
                          className="tla-form-control w-full"
                          onChange={(event) => setQuery(event.target.value)}
                          displayValue={(val) =>
                            zipcodeData?.data?.find((z) => z._id === val)
                              ?.zipcode || ''
                          }
                          placeholder="Select a Zipcode"
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </ComboboxButton>
                        {filteredZipcodes?.length > 0 && (
                          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {filteredZipcodes.map((item) => (
                              <ComboboxOption
                                key={item._id}
                                value={item._id}
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
                    <FormMessage />
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
                      disabled={!zipCode} // disable if no zipcode selected
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
                            renderValue={(selectedValue) => {
                              const selectedItem = ranges?.find(
                                (item) => String(item.value) === selectedValue
                              );
                              return selectedItem?.label || '';
                            }}
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
                              {item.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="tla-btn tla-btn-outline"
                  onClick={() => dispatch(prevStep())}
                >
                  Back
                </button>
                <button type="submit" className="tla-btn tla-btn-primary">
                  Next
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
