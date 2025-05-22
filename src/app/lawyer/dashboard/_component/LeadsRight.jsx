'use client';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { Database, SlidersVertical } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const LeadsRight = ({ isExpanded, onViewDetails }) => {
  return (
    <>
      <section className="lg:px-4">
        <h1 className="font-bold text-lg md:text-2xl text-[#0B1C2D] text-left">
          Found 40 Matching Leads
        </h1>

        <div className="flex flex-wrap justify-center lg:justify-between items-center my-3 gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[#34495E]">
            <Link href="#" className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>Showing all 40 leads -</span>
            </Link>

            <span className="hidden lg:inline">|</span>

            <div className="lg:flex items-center gap-2">
              <h2 className="text-center lg:text-balance">Services:</h2>
              <div className="inline-flex flex-wrap gap-2">
                <TagButton text="Family Law" bgColor="#FF86021A" />
                <TagButton text="Divorce Law" bgColor="#004DA61A" />
                <TagButton text="1+ more" bgColor="#7070701A" />
              </div>
            </div>

            <span className="hidden lg:inline">|</span>

            <h2 className="text-center md:text-left">
              <span>Location:</span> Elgin St. Celina, Delaware...
            </h2>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button className="font-medium text-[#0194EF] flex items-center gap-2">
                <span>Filter Result</span> <SlidersVertical />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="top-0 w-full max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-left">Filter Leads</SheetTitle>
              </SheetHeader>

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

                <div>
                  <label className="text-sm font-medium block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Search by location"
                  />
                </div>

                <button className="w-full mt-2 px-4 py-2 bg-[#0194EF] text-white rounded-lg font-medium hover:bg-[#007ccd] transition">
                  Apply Filters
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <hr className="border border-[#F3F3F3]" />
      </section>

      {/* lead card section */}
      <section
        className={`grid ${
          isExpanded
            ? 'grid-cols-3'
            : 'grid-cols-1 overflow-y-auto h-[calc(100vh-74px-100px)] pb-36'
        } gap-4 lg:px-4 mt-4 mb-10`}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LeadCard key={i} onViewDetails={onViewDetails} />
        ))}
      </section>
    </>
  );
};

export default LeadsRight;
