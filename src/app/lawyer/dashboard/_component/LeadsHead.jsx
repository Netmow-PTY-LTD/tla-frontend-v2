import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { Database, Files, MapPin, SlidersVertical, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import FilterSidebar from './FilterSidebar';

export default function LeadsHead({ isExpanded, total }) {
  return (
    <section className={`${isExpanded ? 'pr-4' : 'px-4'}`}>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h2
            className={`font-bold ${
              isExpanded ? 'heading' : 'heading-base'
            } text-[#0B1C2D] text-left`}
          >
            {total} Matching Leads
          </h2>
          <div className="flex items-center gap-2">
            <Files className="w-4 h-4" />
            <span className={`${isExpanded ? 'admin-text' : 'text-[11px]'}`}>
              4 Services
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className={`${isExpanded ? 'admin-text' : 'text-[11px]'}`}>
              4 Locations
            </span>
          </div>
        </div>
        <Link
          href={'/lawyer/settings/profile'}
          className={`${isExpanded ? 'admin-text' : 'text-[12px]'}`}
        >
          Edit
        </Link>
      </div>

      <div className="flex flex-wrap lg:justify-between items-center my-3 gap-2">
        <div
          className={`flex flex-wrap items-center gap-2 text-[#34495E] ${
            isExpanded ? 'w-[calc(100%-100px)]' : ''
          }`}
        >
          <Link
            href="#"
            className={`flex items-center gap-2 ${
              isExpanded ? 'admin-text' : 'text-[12px]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>
              {isExpanded ? 'Showing all 112 leads' : '96 of 112 leads'}{' '}
            </span>
          </Link>
          {/* <span className="hidden lg:inline text-[#919FAC]">|</span> */}
          <div
            className={`lg:flex items-center gap-2 ${
              isExpanded ? 'ml-auto' : ''
            }`}
          >
            {!isExpanded && (
              <div className="text-[#C72C41] text-[11px] flex items-center gap-2">
                <span>Clear</span>
                <div className="bg-[#D9D9D9] rounded-full cursor-pointer p-1">
                  <X className="w-4 h-4" />
                </div>
              </div>
            )}
            <div className="inline-flex flex-wrap gap-1">
              {/* <TagButton
                text="1st to responded (29)"
                bgColor="#00C3C0"
                textColor="text-[#fff]"
                fontSize={isExpanded ? 'text-[14px]' : 'text-[9px]'}
                rounded="rounded-[5px]"
              /> */}
              <TagButton
                text="Urgent(51)"
                bgColor="#EF8D32"
                textColor="text-[#fff]"
                fontSize={isExpanded ? 'text-[14px]' : 'text-[9px]'}
                rounded="rounded-[5px]"
                // className="hover:bg-gray-950"
              />
            </div>
          </div>
        </div>

        <FilterSidebar />
      </div>

      <hr className=" bg-[#F3F3F3] h-1 w-full" />
    </section>
  );
}
