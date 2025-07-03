'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { Database, Files, MapPin, SlidersVertical, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import FilterResponseSidebar from '../../_component/FilterResponseSidebar';

export default function ResponseHead({ isExpanded }) {
  return (
    <section className={`${isExpanded ? 'pr-4' : 'px-4'}`}>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h2
            className={`font-bold ${
              isExpanded ? 'text-[25px]' : 'text-[16px]'
            } text-[#0B1C2D] text-left`}
          >
            My Responses
          </h2>
          <div className="flex items-center gap-2 mt-2 ">
            <div className="flex item-center">
              <span className={`w-3 h-3 rounded-full bg-[#FF8602] mr-2`}></span>
              <span>3 Pending</span>
            </div>
            <div className="flex item-center">
              <span className={`w-3 h-3 rounded-full bg-[#00C3C0] mr-2`}></span>
              <span>5 Hired</span>
            </div>
          </div>
        </div>
        <Link
          href={'/lawyer/settings/profile'}
          className={`${isExpanded ? 'text-[16px]' : 'text-[12px]'}`}
        >
          Edit
        </Link>
      </div>

      <div className="flex flex-wrap lg:justify-between items-center my-3 gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[#34495E]">
          <Link
            href="#"
            className={`flex items-center gap-2 ${
              isExpanded ? 'text-[16px]' : 'text-[12px]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>
              {isExpanded ? 'Showing all 112 responses' : '96 of 112 responses'}{' '}
            </span>
          </Link>
          <span className="hidden lg:inline text-[#919FAC]">|</span>
          <div className="lg:flex items-center gap-2">
            {!isExpanded && (
              <div className="text-[#C72C41] text-[11px] flex items-center gap-2">
                <span>Clear</span>
                <div className="bg-[#D9D9D9] rounded-full cursor-pointer p-1">
                  <X className="w-4 h-4" />
                </div>
              </div>
            )}
            <div className="inline-flex flex-wrap gap-1">
              <TagButton
                text="1st to responded (29)"
                bgColor="#00C3C0"
                textColor="text-[#fff]"
                fontSize={isExpanded ? 'text-[14px]' : 'text-[9px]'}
                rounded="rounded-[5px]"
              />
              <TagButton
                text="Urgent(51)"
                bgColor="#EF8D32"
                textColor="text-[#fff]"
                fontSize={isExpanded ? 'text-[14px]' : 'text-[9px]'}
                rounded="rounded-[5px]"
              />
            </div>
          </div>
        </div>

        <FilterResponseSidebar />
      </div>

      <hr className="border border-[#F3F3F3]" />
    </section>
  );
}
