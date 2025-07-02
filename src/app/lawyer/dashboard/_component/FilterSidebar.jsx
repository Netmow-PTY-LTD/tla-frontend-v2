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
export default function FilterSidebar() {
  return (
    <Sheet className="z-[9999]">
      <SheetTrigger asChild>
        <button className="font-medium text-[#0194EF] flex items-center gap-2 text-[14px]">
          <SlidersVertical className="w-4 h-4" /> <span>Filter</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="top-0 w-full max-w-sm z-[9999]">
        <SheetHeader>
          <SheetTitle className="text-left">Filter Leads</SheetTitle>
        </SheetHeader>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Keyword Search</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Keyword Search
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Keyword (e.g. name)"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Sort By</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <RadioGroup defaultValue="comfortable">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Default</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">Comfortable</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="compact" id="r3" />
                  <Label htmlFor="r3">Compact</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Return Policy</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                We stand behind our products with a comprehensive 30-day return
                policy. If you&apos;re not completely satisfied, simply return
                the item in its original condition.
              </p>
              <p>
                Our hassle-free return process includes free return shipping and
                full refunds processed within 48 hours of receiving the returned
                item.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Filter Form Example */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">
              Service Type
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-2">
              <option value="all">All</option>
              <option value="family">Family Law</option>
              <option value="divorce">Divorce Law</option>
            </select>
          </div>

          <button className="w-full mt-2 px-4 py-2 bg-[#0194EF] text-white rounded-lg font-medium hover:bg-[#007ccd] transition">
            Apply Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
