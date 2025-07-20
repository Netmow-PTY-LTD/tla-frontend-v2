import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { Files, MapPin, SlidersVertical, SquarePen, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import FilterSidebar from './FilterSidebar';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';

export default function LeadsHead({ isExpanded, total, setSearchKeyword }) {
  const { data: currentUser } = useAuthUserInfoQuery();

  //console.log('currentUser ==>', currentUser?.data);

  const stored = localStorage.getItem('lead-filters');

  return (
    <section className={`${isExpanded ? '' : 'pl-4 pr-1'}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <h2
            className={`font-bold ${
              isExpanded ? 'heading' : 'heading-base'
            } text-[#0B1C2D] text-left`}
          >
            {total} Matches
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Files className="w-4 h-4" />
              <span className={`${isExpanded ? 'text-[14px]' : 'text-[11px]'}`}>
                {currentUser?.data?.profile?.serviceIds?.length || 0} Services
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className={`${isExpanded ? 'text-[14px]' : 'text-[11px]'}`}>
                4 Locations
              </span>
            </div>
          </div>
        </div>
        <Link
          href={'/lawyer/settings/lead-settings'}
          className={`${
            isExpanded ? 'admin-text' : 'text-[12px]'
          } py-1 px-2 bg-[#FF8602] rounded-[5px] text-white hover:bg-[#FF8602] transition-all flex items-center gap-2`}
        >
          <span>Edit</span>
          {/* <SquarePen className="w-4 h-4 hidden sm:inline" /> */}
        </Link>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-2 mb-3 gap-2">
        <div
          className={`flex flex-wrap items-center gap-2 text-[#34495E] ${
            isExpanded ? 'w-[calc(100%-100px)]' : ''
          }`}
        >
          <div className={`lg:flex items-center gap-2`}>
            {stored && !isExpanded && (
              <div
                className="text-[#C72C41] text-[11px] flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem('lead-filters');
                  alert('filter removed');
                  window.location.href = '/lawyer/dashboard/leads-board';
                }}
              >
                <span>Clear</span>
                <div className="bg-[#D9D9D9] rounded-full cursor-pointer p-1">
                  <X className="w-4 h-4" />
                </div>
              </div>
            )}

            <div className="inline-flex flex-wrap gap-1">
              <TagButton
                text="Urgent(51)"
                bgColor="#EF8D32"
                textColor="text-[#fff]"
                fontSize={isExpanded ? 'text-[12px]' : 'text-[9px]'}
                rounded="rounded-[5px]"
                // className="hover:bg-gray-950"
              />
            </div>
          </div>
        </div>

        <FilterSidebar data={currentUser?.data} setSearchKeyword={setSearchKeyword} />
      </div>

      <hr className=" bg-[#F3F3F3] h-1 w-full" />
    </section>
  );
}
