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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
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

export default function FilterSidebar({ data }) {
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
    console.log('stored in filter ==>', stored);
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
                  <label htmlFor="asc" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="asc"
                      value="asc"
                      {...register('sort')}
                    />
                    Newest First
                  </label>
                  <label htmlFor="desc" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="desc"
                      value="desc"
                      {...register('sort')}
                    />
                    Oldest First
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* View */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline">
                View
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance ">
                  <label htmlFor="read" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="read"
                      value="read"
                      {...register('view')}
                    />
                    Read
                  </label>
                  <label htmlFor="unread" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="unread"
                      value="unread"
                      {...register('view')}
                    />
                    Unread
                  </label>
                  <label htmlFor="any" className="flex items-center gap-2">
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
            </AccordionItem>

            {/* Spotlight */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline">
                Lead Spotlight
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  <label htmlFor="urgent" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="urgent"
                      value="urgent"
                      {...register('spotlight')}
                    />
                    Urgent
                  </label>
                  <label htmlFor="lead-any" className="flex items-center gap-2">
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
                    htmlFor="last-hour"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id="last-hour"
                      value="last-hour"
                      {...register('lead-submission')}
                    />
                    Last Hour
                  </label>
                  <label htmlFor="today" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="today"
                      value="today"
                      {...register('lead-submission')}
                    />
                    Today
                  </label>
                  <label
                    htmlFor="yesterday"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id="yesterday"
                      value="yesterday"
                      {...register('lead-submission')}
                    />
                    Yesterday
                  </label>
                  <label
                    htmlFor="3days-ago"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id="3days-ago"
                      value="3days-ago"
                      {...register('lead-submission')}
                    />
                    Less than 3 days ago
                  </label>
                  <label
                    htmlFor="7days-ago"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id="7days-ago"
                      value="7days-ago"
                      {...register('lead-submission')}
                    />
                    Less than 7 days ago
                  </label>
                  <label
                    htmlFor="2weeks-ago"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id="2weeks-ago"
                      value="2weeks-ago"
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
                          className="flex items-center gap-2"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            id={service?.name}
                            value={service?.name}
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
            <AccordionItem value="item-7">
              <AccordionTrigger className="hover:no-underline">
                Locations
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  <label htmlFor="all" className="flex items-center gap-2">
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
                    className="flex items-center gap-2"
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
                    className="flex items-center gap-2"
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
            </AccordionItem>

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
                          className="flex items-center gap-2"
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
