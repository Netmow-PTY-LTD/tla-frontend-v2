'use client';
import React, { useEffect } from 'react';
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

export default function FilterSidebar({ data, setSearchKeyword, setLeads }) {
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
    console.log('Form values:', values);
    // payload shape transformation (if needed)
    const payload = {
      keyword: values.keyword,
      sort: values.sort,
      view: values.view,
      spotlight: values.spotlight,
      leadSubmission: values['lead-submission'],
      location: values.location,
      services: values.service, // array of checked
      credits: values.credit, // array of checked
    };

    console.log('Filter Payload:', payload);
    setSearchKeyword(payload);
    setLeads([]);

    // Now you can call API or update state
    localStorage.setItem('lead-filters', JSON.stringify(payload));
    // Show toast
    showSuccessToast('Filters applied and saved.');
  };

  return (
    <Sheet className="z-[9999]">
      <SheetTrigger asChild>
        <button className="font-medium text-[#0194EF] flex items-center gap-2 text-[14px]">
          <SlidersVertical className="w-4 h-4" /> <span>Filter</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="top-0 w-full max-w-sm z-[9999] flex flex-col h-full"
      >
        <SheetHeader>
          <SheetTitle className="text-left">Filter Leads</SheetTitle>
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
                  <label htmlFor="desc" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="desc"
                      value="desc"
                      {...register('sort')}
                    />
                    Newest First
                  </label>
                  <label htmlFor="asc" className="flex items-center gap-2">
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
                Lead Spotlight
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  <label
                    htmlFor="urgent"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="urgent"
                      value="urgent"
                      {...register('spotlight')}
                    />
                    Urgent
                  </label>
                  <label
                    htmlFor="lead-any"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="lead-any"
                      value="lead-any"
                      {...register('spotlight')}
                    />
                    Any
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Lead Submission */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="hover:no-underline">
                When the lead was submitted
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
                Services
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {data?.profile?.serviceIds?.length > 0 &&
                    data?.profile?.serviceIds?.map((service, index) => {
                      return (
                        <label
                          htmlFor={service?.name}
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
                  <label
                    htmlFor="all"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="all"
                      value="all"
                      {...register('location')}
                    />
                    All
                  </label>
                  <label
                    htmlFor="nationwide"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="nationwide"
                      value="nationwide"
                      {...register('location')}
                    />
                    Nationwide
                  </label>
                  <label
                    htmlFor="location-4217"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id="location-4217"
                      value="location-4217"
                      {...register('location')}
                    />
                    Within 50 Miles of 4217
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem> */}

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
              onClick={() => reset()}
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
