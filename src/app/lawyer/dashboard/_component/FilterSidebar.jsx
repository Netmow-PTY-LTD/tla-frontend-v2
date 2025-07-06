import React from 'react';
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

export default function FilterSidebar() {
  const { data: currentUser } = useAuthUserInfoQuery();

  console.log('currentUser ==>', currentUser?.data);

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

        <Accordion
          type="single"
          collapsible
          className="w-full flex-1"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              Keyword Search
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Keyword (e.g. name)"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              Sort By
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                <label htmlFor="asc" className="flex items-center gap-2">
                  <input type="radio" id="asc" name="sort" value="asc" />
                  Newest First
                </label>
                <label htmlFor="desc" className="flex items-center gap-2">
                  <input type="radio" id="desc" name="sort" value="desc" />
                  Oldest First
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              View
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance ">
                <label htmlFor="read" className="flex items-center gap-2">
                  <input type="radio" id="read" name="view" value="read" />
                  Read
                </label>
                <label htmlFor="unread" className="flex items-center gap-2">
                  <input type="radio" id="unread" name="view" value="unread" />
                  Unread
                </label>
                <label htmlFor="any" className="flex items-center gap-2">
                  <input type="radio" id="any" name="view" value="any" />
                  Any
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
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
                    name="spotlight"
                    value="urgent"
                  />
                  Urgent
                </label>
                <label htmlFor="lead-any" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="lead-any"
                    name="spotlight"
                    value="lead-any"
                  />
                  Any
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="hover:no-underline">
              When the lead was submitted
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                <label htmlFor="last-hour" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="last-hour"
                    name="lead-submission"
                    value="urgent"
                  />
                  Last Hour
                </label>
                <label htmlFor="today" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="today"
                    name="lead-submission"
                    value="today"
                  />
                  Today
                </label>
                <label htmlFor="yesterday" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="yesterday"
                    name="lead-submission"
                    value="yesterday"
                  />
                  Yesterday
                </label>
                <label htmlFor="3days-ago" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="3days-ago"
                    name="lead-submission"
                    value="3days-ago"
                  />
                  Less than 3 days ago
                </label>
                <label htmlFor="7days-ago" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="7days-ago"
                    name="lead-submission"
                    value="7days-ago"
                  />
                  Less than 7 days ago
                </label>
                <label htmlFor="2weeks-ago" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="2weeks-ago"
                    name="lead-submission"
                    value="2weeks-ago"
                  />
                  Less than 2 weeks ago
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="hover:no-underline">
              Services
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                {currentUser?.data?.profile?.serviceIds?.length > 0 &&
                  currentUser?.data?.profile?.serviceIds?.map(
                    (service, index) => {
                      return (
                        <label
                          htmlFor={service?.name}
                          className="flex items-center gap-2"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            id={service?.name}
                            name="service"
                            value={service?.name}
                          />
                          {service?.name}
                        </label>
                      );
                    }
                  )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="hover:no-underline">
              Locations
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                <label htmlFor="all" className="flex items-center gap-2">
                  <input type="radio" id="all" name="location" value="all" />
                  All
                </label>
                <label htmlFor="nationwide" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="nationwide"
                    name="location"
                    value="nationwide"
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
                    name="location"
                    value="location-4217"
                  />
                  Within 50 Miles of 4217
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
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
                          name="service"
                          value={credit?.range}
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
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <Button className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg font-medium transition">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
