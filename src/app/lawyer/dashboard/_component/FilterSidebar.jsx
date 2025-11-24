'use client';
import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SlidersVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { showSuccessToast } from '@/components/common/toasts';
import { useGetAllLocationsQuery } from '@/store/features/lawyer/locationApiService';
import LocationAccordionItem from './LocationAccordionItem';

const creditTiers = [
  { id: 1, range: 'Free' },
  { id: 2, range: '1-5 credits' },
  { id: 3, range: '5-10 credits' },
  { id: 4, range: '10-20 credits' },
  { id: 5, range: '20-30 credits' },
  { id: 6, range: '30-40 credits' },
  { id: 7, range: '40-50 credits' },
  { id: 8, range: '50-100 credits' },
];


const transformLocationToCoordinates = (value) => {
  if (!value) return null;

  // Parse the stringified JSON from the radio input
  let loc;
  try {
    loc = JSON.parse(value);
  } catch (error) {
    console.error('Invalid location value:', value);
    return null;
  }

  if (loc.locationType === 'nation_wide') {

    return null;
  }

  return {
    locationType: loc.locationType,
    coord: loc.coord || [0, 0], // [longitude, latitude]
    traveltime: loc.traveltime ? Number(loc.traveltime) : null,
    rangeInKm: loc.rangeInKm ? Number(loc.rangeInKm) : null,
    travelmode: loc.travelmode || 'driving',
    serviceIds: loc.serviceIds || [],
    sortByDistance: true, // optional, sort nearest first
  };
};







export default function FilterSidebar({
  data,
  setSearchKeyword,
  setLeads,
  page,
  setPage,
  locationdata
}) {
  const [isOpen, setIsOpen] = useState(false); // <-- Control sidebar visibility
  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm(
    {
      defaultValues: {
        keyword: '',
        sort: '',
        view: '',
        spotlight: '',
        'lead-submission': '',
        location: '',
        service: [],
        credit: [],
        coordinates: null,
      },
    }
  );

  useEffect(() => {
    const stored = localStorage.getItem('lead-filters');
    if (stored) {
      const parsed = JSON.parse(stored);
      reset({
        keyword: parsed.keyword || '',
        sort: parsed.sort || '',
        view: parsed.view || '',
        spotlight: parsed.spotlight || '',
        'lead-submission': parsed.leadSubmission || '',
        location: parsed.location || '',
        service: parsed.services || [],
        credit: parsed.credits || [],
      });
    }
  }, [reset]);

  const onSubmit = (values) => {
    // payload shape transformation (if needed)
    //setPage(1);
    const payload = {
      // page: page,
      keyword: values.keyword,
      sort: values.sort,
      view: values.view,
      spotlight: values.spotlight,
      leadSubmission: values['lead-submission'],
      // location: values.location,
      services: values.service, // array of checked
      credits: values.credit, // array of checked
      coordinates: transformLocationToCoordinates(values?.location),
    };

    // console.log('payload filtering coord', payload);


    // const coordinates= {
    //     coord: [151.2093, -33.8688], // [longitude, latitude]
    //     maxMinutes: 15,
    //     mode: 'driving',
    //     sortByDistance: true, // optional, sort by nearest first
    //   }


    // console.log('payload', payload);

    setSearchKeyword(payload);
    // Now you can call API or update state
    localStorage.setItem('lead-filters', JSON.stringify(payload));
    // Show toast
    showSuccessToast('Filters applied and saved.');
    // Close sidebar after form submit
    setIsOpen(false);
    //setLeads([]);
  };




  const locations = [
    { id: 'all', label: 'All', value: 'all' },
    { id: 'nationwide', label: 'Nationwide', value: 'nationwide' },
    { id: 'dhaka-50', label: 'Within 50 Miles of Dhaka', value: 'dhaka-50' },
    { id: 'chattogram-30', label: 'Within 30 Miles of Chattogram', value: 'chattogram-30' },
    { id: 'sylhet-25', label: 'Within 25 Miles of Sylhet', value: 'sylhet-25' },
    { id: 'rajshahi-40', label: 'Within 40 Miles of Rajshahi', value: 'rajshahi-40' },
    { id: 'khulna-35', label: 'Within 35 Miles of Khulna', value: 'khulna-35' },
    { id: 'rangpur-20', label: 'Within 20 Miles of Rangpur', value: 'rangpur-20' },
    { id: 'barishal-30', label: 'Within 30 Miles of Barishal', value: 'barishal-30' },
    { id: 'mymensingh-25', label: 'Within 25 Miles of Mymensingh', value: 'mymensingh-25' },
  ];







  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} className="z-[9999]">
      <SheetTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className="font-medium text-[#0194EF] flex items-center gap-2 text-[14px]"
        >
          <SlidersVertical className="w-4 h-4" /> <span>Filter</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="top-0 w-full max-w-sm z-[9999] flex flex-col h-full"
      >
        <SheetHeader>
          <SheetTitle className="text-left">Filter Cases</SheetTitle>
        </SheetHeader>

        <form
          className="flex flex-col flex-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full flex-1"
            defaultValue="item-1"
          >
            {/* Keyword */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline">
                Keyword Search
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  <div>
                    <input
                      type="text"
                      {...register('keyword')}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Keyword (e.g. name)"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sort */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:no-underline">
                Sort By
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  <label
                    htmlFor="desc"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="desc"
                      value="desc"
                      {...register('sort')}
                    />
                    Newest First
                  </label>
                  <label
                    htmlFor="asc"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="asc"
                      value="asc"
                      {...register('sort')}
                    />
                    Oldest First
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* View */}
            {/* <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline">
                View
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance ">
                  <label
                    htmlFor="read"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="read"
                      value="read"
                      {...register('view')}
                    />
                    Read
                  </label>
                  <label
                    htmlFor="unread"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="unread"
                      value="unread"
                      {...register('view')}
                    />
                    Unread
                  </label>
                  <label
                    htmlFor="any"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="any"
                      value="any"
                      {...register('view')}
                    />
                    Any
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem> */}

            {/* Spotlight */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline">
                Case Spotlight
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {[
                    { value: 'urgent', label: 'Urgent' },
                    { value: 'within_a_week', label: 'Within a Week' },
                    { value: 'this_month', label: 'This Month' },
                    { value: 'not_sure', label: 'Not Sure' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={option.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        id={option.value}
                        value={option.value}
                        {...register('spotlight')}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Case Submission */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="hover:no-underline">
                When the case was submitted
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  <label
                    htmlFor="last_1_hour"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="last_1_hour"
                      value="last_1_hour"
                      {...register('lead-submission')}
                    />
                    Last Hour
                  </label>
                  <label
                    htmlFor="last_24_hours"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="last_24_hours"
                      value="last_24_hours"
                      {...register('lead-submission')}
                    />
                    Today
                  </label>
                  <label
                    htmlFor="last_48_hours"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="last_48_hours"
                      value="last_48_hours"
                      {...register('lead-submission')}
                    />
                    Yesterday
                  </label>
                  <label
                    htmlFor="last_3_days"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="last_3_days"
                      value="last_3_days"
                      {...register('lead-submission')}
                    />
                    Less than 3 days ago
                  </label>
                  <label
                    htmlFor="last_7_days"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="last_7_days"
                      value="last_7_days"
                      {...register('lead-submission')}
                    />
                    Less than 7 days ago
                  </label>
                  <label
                    htmlFor="last_14_days"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="last_14_days"
                      value="last_14_days"
                      {...register('lead-submission')}
                    />
                    Less than 2 weeks ago
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Services */}
            <AccordionItem value="item-6">
              <AccordionTrigger className="hover:no-underline">
                Skills
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {data?.profile?.serviceIds?.length > 0 &&
                    data?.profile?.serviceIds?.map((service, index) => {
                      return (
                        <label
                          htmlFor={service?._id}
                          className="flex items-center gap-2 cursor-pointer"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            id={service?._id}
                            value={service?._id}
                            {...register('service')}
                          />
                          {service?.name}
                        </label>
                      );
                    })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Location */}

            {/* <AccordionItem value="item-7">
              <AccordionTrigger className="hover:no-underline">
                Locations
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {locationdata?.data?.map((loc) => (
                    <label
                      key={loc.id}
                      htmlFor={loc.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id={loc.id}
                        value={loc.value}
                        {...register('location')}
                      />
                      {loc.label}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem> */}

            <LocationAccordionItem
              register={register}
              locationdata={locationdata}
            />

            {/* Credits */}
            <AccordionItem value="item-8">
              <AccordionTrigger className="hover:no-underline">
                Credits
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {creditTiers?.length > 0 &&
                    creditTiers?.map((credit, index) => {
                      return (
                        <label
                          htmlFor={credit?.range}
                          className="flex items-center gap-2 cursor-pointer"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            id={credit?.range}
                            value={credit?.range}
                            {...register('credit')}
                          />
                          {credit?.range}
                        </label>
                      );
                    })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="border-t border-[#D9D9D9] pt-5 flex flex-wrap justify-between mt-auto">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg font-medium transition"
            >
              Apply Filters
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
