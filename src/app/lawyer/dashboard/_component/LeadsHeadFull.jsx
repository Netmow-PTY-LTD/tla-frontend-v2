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

export default function LeadsHead({ isExpanded }) {
  return (
    <section className={`${isExpanded ? 'pr-4' : 'px-4'}`}>
      <h2 className="font-bold text-[25px] text-[#0B1C2D] text-left">
        112 Matching Cases
      </h2>

      <div className="flex flex-wrap lg:justify-between items-center my-3 gap-4">
        <div className="flex flex-wrap items-center gap-2 text-[#34495E]">
          <Link href="#" className="flex items-center gap-2 text-[14px]">
            <Database className="w-5 h-5" />
            <span>Showing all 40 Cases -</span>
          </Link>

          <span className="hidden lg:inline">|</span>

          <div className="lg:flex items-center gap-2">
            <h4 className="text-center lg:text-balance text-[14px]">
              Services:
            </h4>
            <div className="inline-flex flex-wrap gap-2">
              <TagButton text="Family Law" bgColor="#FF86021A" />
              <TagButton text="Divorce Law" bgColor="#004DA61A" />
              <TagButton text="1+ more" bgColor="#7070701A" />
            </div>
          </div>

          <span className="hidden lg:inline">|</span>

          <h2 className="text-center md:text-left text-[14px]">
            <span>Location:</span> Elgin St. Celina, Delaware...
          </h2>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="font-medium text-[#0194EF] flex items-center gap-2 text-[14px]">
              <span>Filter Result</span> <SlidersVertical className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="top-0 w-full max-w-sm">
            <SheetHeader>
              <SheetTitle className="text-left">Filter Cases</SheetTitle>
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
  );
}
