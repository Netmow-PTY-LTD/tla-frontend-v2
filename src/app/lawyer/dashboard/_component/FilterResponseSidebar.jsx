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

export default function FilterResponseSidebar() {
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
        className="top-0 w-full max-w-sm z-[9999] flex flex-col h-full overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle className="text-left">Filter Responses</SheetTitle>
        </SheetHeader>

        <Accordion
          type="single"
          collapsible
          className="w-full flex-1 overflow-y-auto"
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
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
                    placeholder="Keyword (e.g. name)"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              Lead Spotlight
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                <label htmlFor="urgent" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    name="spotlight"
                    value="urgent"
                  />
                  Urgent
                </label>
                <label
                  htmlFor="client-requested"
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="client-requested"
                    name="spotlight"
                    value="client-requested"
                  />
                  Client Requested
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              Actions Client has taken
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                <label
                  htmlFor="client-quote"
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="client-quote"
                    name="client-action"
                    value="client-quote"
                  />
                  Client has requested a quote
                </label>
                <label
                  htmlFor="client-interest"
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="client-interest"
                    name="client-action"
                    value="client-interest"
                  />
                  ⁠Client has expressed an interest
                </label>
                <label
                  htmlFor="client-message"
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="client-message"
                    name="client-action"
                    value="client-message"
                  />
                  ⁠Client send a message
                </label>
                <label
                  htmlFor="client-callback"
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="client-callback"
                    name="client-action"
                    value="client-callback"
                  />
                  ⁠Client has requested a callback
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="hover:no-underline">
              Actions has taken
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <div className="flex flex-col gap-4 text-balance">
                <label htmlFor="no-action" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="no-action"
                    name="action-taken"
                    value="no-action"
                  />
                  Taken no action
                </label>
                <label htmlFor="called" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="called"
                    name="action-taken"
                    value="called"
                  />
                  Called
                </label>
                <label htmlFor="send-email" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="send-email"
                    name="action-taken"
                    value="send-email"
                  />
                  Send Email
                </label>
                <label htmlFor="send-sms" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="send-sms"
                    name="action-taken"
                    value="send-sms"
                  />
                  Send SMS
                </label>
                <label htmlFor="made-note" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="made-note"
                    name="action-taken"
                    value="made-note"
                  />
                  Made Note
                </label>
                <label
                  htmlFor="one-click-response"
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    id="one-click-response"
                    name="action-taken"
                    value="one-click-response"
                  />
                  Sent One Click Response
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="hover:no-underline">
              Data wise Response
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
                <label htmlFor="last-month" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="last-month"
                    name="lead-submission"
                    value="last-month"
                  />
                  Within Last Month
                </label>
                <label htmlFor="six-month" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="six-month"
                    name="lead-submission"
                    value="six-month"
                  />
                  Within Six Month
                </label>
                <label htmlFor="last-year" className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="last-year"
                    name="lead-submission"
                    value="last-year"
                  />
                  Within last year
                </label>
                <label
                  htmlFor="one-year-ago"
                  className="flex items-center gap-2"
                >
                  <input
                    type="radio"
                    id="one-year-ago"
                    name="lead-submission"
                    value="one-year-ago"
                  />
                  Over 1 year ago
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="border-t border-[#D9D9D9] pt-5 flex flex-wrap justify-between mt-auto">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <button className="px-4 py-2 bg-[#0194EF] text-white rounded-lg font-medium hover:bg-[#007ccd] transition">
            Apply Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
