
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
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

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

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      keyword: '',
      spotlight: [],
      clientActions: [],
      actionsTaken: [],
      leadSubmission: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Filters Applied:', data);
    // Perform API call or state update with filter data
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
          <SheetTitle className="text-left">Filter Responses</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <Accordion
            type="single"
            collapsible
            className="w-full flex-1"
            defaultValue="item-1"
          >
            {/* Keyword Search */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline">
                Keyword Search
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  <input
                    type="text"
                    {...register('keyword')}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
                    placeholder="Keyword (e.g. name)"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Lead Spotlight */}
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
                      value="urgent"
                      {...register('spotlight')}
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
                      value="client-requested"
                      {...register('spotlight')}
                    />
                    Client Requested
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Client Actions */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline">
                Actions Client has taken
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {[
                    { id: 'client-quote', label: 'Client has requested a quote' },
                    { id: 'client-interest', label: 'Client has expressed an interest' },
                    { id: 'client-message', label: 'Client send a message' },
                    { id: 'client-callback', label: 'Client has requested a callback' },
                  ].map((item) => (
                    <label key={item.id} htmlFor={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={item.id}
                        value={item.id}
                        {...register('clientActions')}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Actions Taken */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline">
                Actions has taken
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {[
                    { id: 'no-action', label: 'Taken no action' },
                    { id: 'called', label: 'Called' },
                    { id: 'send-email', label: 'Send Email' },
                    { id: 'send-sms', label: 'Send SMS' },
                    { id: 'made-note', label: 'Made Note' },
                    { id: 'one-click-response', label: 'Sent One Click Response' },
                  ].map((item) => (
                    <label key={item.id} htmlFor={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={item.id}
                        value={item.id}
                        {...register('actionsTaken')}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Date Wise Response */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="hover:no-underline">
                Date wise Response
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col gap-4 text-balance">
                  {[
                    'last-hour', 'today', 'yesterday', '3days-ago',
                    '7days-ago', '2weeks-ago', 'last-month',
                    'six-month', 'last-year', 'one-year-ago'
                  ].map((id) => (
                    <label key={id} htmlFor={id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={id}
                        value={id}
                        {...register('leadSubmission')}
                      />
                      {id.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Footer Buttons */}
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
