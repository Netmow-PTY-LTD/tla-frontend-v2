import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@headlessui/react'; // Only if using HeadlessUI
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // Utility for conditional classNames

export default function RegisterStepTwoTest({
  handleStep,
  handleBack,
  practice,
  setPractice,
  practiceArea,
  setPracticeArea,
  areaZipcode,
  setAreaZipcode,
  practiceInternational,
  setPracticeInternational,
  areaRange,
  setAreaRange,
  setAreaZipValue,
  areaZipValue,
}) {
  const [query, setQuery] = useState('');
  const [selectedZip, setSelectedZip] = useState('');

  const formSchema = z
    .object({
      practiceWithin: z.boolean(),
      practiceInternational: z.boolean(),
      AreaZipcode: z.string().optional(),
      areaRange: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.practiceWithin && !data.practiceInternational) {
        ctx.addIssue({
          path: ['practiceWithin'], // highlights the checkbox
          code: z.ZodIssueCode.custom,
          message: 'You must select at least one option',
        });
      }

      if (data.practiceWithin) {
        if (!data.AreaZipcode || data.AreaZipcode.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Area Zipcode is required when practicing within',
            path: ['AreaZipcode'],
          });
        }
        if (!data.areaRange || data.areaRange.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Area Range is required when practicing within',
            path: ['areaRange'],
          });
        }
      }
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      practiceWithin: practice || false,
      practiceInternational: practiceInternational || false,
      AreaZipcode: areaZipValue || '',
      areaRange: practiceArea || '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const areaZipList = {
    data: [
      {
        _id: 'id1',
        zip: '2000 – Sydney, NSW',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id2',
        zip: '3000 – Melbourne, VIC',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id3',
        zip: '4000 – Brisbane, QLD',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id4',
        zip: '5000 – Adelaide, SA',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id5',
        zip: '6000 – Perth, WA',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id6',
        zip: '7000 – Hobart, TAS',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id7',
        zip: '0800 – Darwin, NT',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id8',
        zip: '2600 – Canberra, ACT',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id9',
        zip: '2010 – Darlinghurst, NSW',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id10',
        zip: '4217 – Surfers Paradise, QLD',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id11',
        zip: '2444 – Port Macquarie, NSW',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id12',
        zip: '3350 – Ballarat, VIC',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id13',
        zip: '0870 – Alice Springs, NT',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id14',
        zip: '0801 – Darwin City, NT',
        countryId: '682c4cc84c93ea5164dde92d',
      },
      {
        _id: 'id15',
        zip: '6150 – Fremantle, WA',
        countryId: '682c4cc84c93ea5164dde92d',
      },
    ],
  };

  const filteredZipcodes = areaZipList?.data?.filter((item) =>
    item.zip.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap">
        <div className="hidden lg:block lg:max-w-[602]">
          <div className="tla-auth-image">
            <Image
              src="/assets/img/auth-step2.png"
              width={600}
              height={751}
              alt="Auth Image"
            />
          </div>
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="practiceWithin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            // Let user toggle checkbox normally
                            field.onChange(checked);
                            setPractice(checked);
                          }}
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
                        value={field.value} // string zip code
                        onChange={(val) => {
                          field.onChange(val.zip); // pass string zip
                          setAreaZipcode(val._id); // save id separately
                          setAreaZipValue(val.zip); // save id separately
                          if (val?.zip?.trim() !== '') {
                            form.setValue('practiceWithin', true);
                            setPractice(true);
                          } else {
                            form.setValue('practiceWithin', false);
                            setPractice(false);
                            setAreaZipcode(null);
                            setAreaZipValue(null); // save id separately
                          }
                        }}
                      >
                        <div className="relative">
                          <Combobox.Input
                            className="tla-form-control w-full"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(val) => val || ''}
                            placeholder="Select a Zipcode"
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </Combobox.Button>

                          {filteredZipcodes?.length > 0 && (
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {filteredZipcodes.map((item) => (
                                <Combobox.Option
                                  key={item._id}
                                  value={item} // full object for selection
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
                                        {item.zip}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <Check className="h-4 w-4" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="areaRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Range of Area</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value); // Update react-hook-form state
                          setPracticeArea(value); // Update your local state

                          // If user selects a service, force practiceWithin checkbox to true
                          if (value.trim() !== '') {
                            form.setValue('practiceWithin', true);
                            setPractice(true);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl className="tla-form-control">
                          <SelectTrigger>
                            <SelectValue placeholder="Select range of area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="20">20 miles</SelectItem>
                          <SelectItem value="30">30 miles</SelectItem>
                          <SelectItem value="50">50 miles</SelectItem>
                          <SelectItem value="70">70 miles</SelectItem>
                          <SelectItem value="100">100 miles</SelectItem>
                          <SelectItem value="120">120 miles</SelectItem>
                          <SelectItem value="150">150 miles</SelectItem>
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
                          checked={field.value} // control from react-hook-form
                          onCheckedChange={(checked) => {
                            field.onChange(checked); // update form state
                            setPracticeInternational(checked); // update your custom state
                          }}
                        />
                      </FormControl>
                      <FormLabel className="ml-2 font-bold">
                        I will practice internationally all over the world
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap justify-between gap-4 mt-10">
                  <div className="flex gap-2 items-center">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                      >
                        <path
                          d="M10 17.71C8.51667 17.71 7.06659 17.2701 5.83322 16.446C4.59986 15.6219 3.63857 14.4505 3.07091 13.0801C2.50325 11.7096 2.35472 10.2016 2.64412 8.74679C2.9335 7.29193 3.64781 5.95556 4.6967 4.90666C5.7456 3.85777 7.08197 3.14346 8.53683 2.85408C9.99167 2.56468 11.4997 2.71321 12.8702 3.28087C14.2406 3.84853 15.4119 4.80982 16.236 6.04318C17.0602 7.27655 17.5 8.72663 17.5 10.21C17.5 12.1991 16.7098 14.1067 15.3033 15.5133C13.8968 16.9198 11.9892 17.71 10 17.71ZM10 3.95996C8.76383 3.95996 7.5555 4.32652 6.52769 5.01328C5.49988 5.70003 4.6988 6.67615 4.22576 7.81819C3.75271 8.96021 3.62894 10.2169 3.87009 11.4293C4.11125 12.6416 4.70651 13.7553 5.58058 14.6294C6.45467 15.5035 7.56831 16.0987 8.78067 16.3399C9.99308 16.581 11.2498 16.4573 12.3917 15.9842C13.5338 15.5111 14.5099 14.71 15.1967 13.6823C15.8834 12.6545 16.25 11.4461 16.25 10.21C16.25 8.55238 15.5915 6.96265 14.4194 5.79054C13.2473 4.61844 11.6576 3.95996 10 3.95996Z"
                          fill="#0B1C2D"
                        />
                        <path
                          d="M10 11.0434C9.83492 11.0412 9.67717 10.9747 9.56042 10.858C9.44367 10.7412 9.37717 10.5835 9.375 10.4184V7.50171C9.375 7.33595 9.44083 7.17698 9.55808 7.05977C9.67525 6.94256 9.83425 6.87671 10 6.87671C10.1657 6.87671 10.3248 6.94256 10.4419 7.05977C10.5592 7.17698 10.625 7.33595 10.625 7.50171V10.4184C10.6228 10.5835 10.5563 10.7412 10.4396 10.858C10.3228 10.9747 10.1651 11.0412 10 11.0434Z"
                          fill="#0B1C2D"
                        />
                        <path
                          d="M10 13.5434C9.83492 13.5412 9.67717 13.4747 9.56042 13.358C9.44367 13.2412 9.37717 13.0835 9.375 12.9184V12.5017C9.375 12.336 9.44083 12.177 9.55808 12.0598C9.67525 11.9425 9.83425 11.8767 10 11.8767C10.1657 11.8767 10.3248 11.9425 10.4419 12.0598C10.5592 12.177 10.625 12.336 10.625 12.5017V12.9184C10.6228 13.0835 10.5563 13.2412 10.4396 13.358C10.3228 13.4747 10.1651 13.5412 10 13.5434Z"
                          fill="#0B1C2D"
                        />
                      </svg>
                    </span>
                    <span className="info-text">
                      You can change your location at any time
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="btn-outline"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="button" // prevent default form submit here
                      className="btn-auth-register"
                      onClick={form.handleSubmit(handleStep)} // <-- call handleStep only if form valid
                    >
                      Next
                    </button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
