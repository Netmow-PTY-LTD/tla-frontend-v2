'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import FilterResponseSidebar from '../../_component/FilterResponseSidebar';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ResponseHead({
  isExpanded,
  allResponse,
  setQueryParams,
  queryParams,
  scrollContainerRef,
  setResponses,
  refetch,
  setSelectedResponseId,
  searchParams,
}) {
  const router = useRouter();
  const pathname = usePathname(); // current route without query params
  const data = allResponse?.data || [];
  const total = allResponse?.pagination?.total;
  const pendingStatusLength = allResponse?.counts?.pending;
  const urgent = allResponse?.counts?.urgent;
  const hiredStatusLength = allResponse?.counts?.hired;

  const defaultQueryParams = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    keyword: '',
    spotlight: '',
    clientActions: '',
    actionsTaken: '',
    leadSubmission: '',
  };

  const clearFilters = () => {
    setResponses([]);
    setQueryParams(defaultQueryParams);
    localStorage.removeItem('responseFilters');
    router.push(pathname); // remove all query params
    // Reset scroll position after small delay to ensure new data renders
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 100);

    // 5. Manually refetch new data (if needed)
    refetch();
    toast.success('Clear Filter', {
      position: 'top-right',
      style: {
        background: '#22c55e', // green color
        color: '#fff',
      },
    });
  };

  // const hasActiveFilters = Object.keys(defaultQueryParams).some(
  //   (key) => queryParams[key] !== defaultQueryParams[key]
  // );

  const hasActiveFilters = Object.entries(queryParams).some(([key, value]) => {
    // Only check these keys for non-empty values
    const filterKeysToCheck = [
      'keyword',
      'spotlight',
      'clientActions',
      'actionsTaken',
      'leadSubmission',
    ];

    return filterKeysToCheck.includes(key) && value !== '';
  });

  // console.log('queryParams', queryParams);
  // console.log('hasActiveFilters', hasActiveFilters);

  return (
    <section className={`shadow-custom ${isExpanded ? '' : 'pl-4 pr-1'}`}>
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 sm:gap-4">
          <h2
            className={`font-bold ${
              isExpanded ? 'text-[24px]' : 'text-[16px]'
            } text-[#0B1C2D] text-left`}
          >
            {total} {total > 1 ? 'Responses' : 'Response'}
          </h2>
          <div className="flex items-center gap-3">
            <button
              className={`flex item-center leading-none ${
                isExpanded ? 'text-[14px]' : 'text-[12px]'
              }`}
            >
              <span className={`w-3 h-3 rounded-full bg-[#FF8602] mr-1`}></span>
              <span>{pendingStatusLength} Pending</span>
            </button>
            <button
              className={`flex item-center leading-none ${
                isExpanded ? 'text-[14px]' : 'text-[12px]'
              }`}
            >
              <span className={`w-3 h-3 rounded-full bg-[#00C3C0] mr-1`}></span>
              <span>{hiredStatusLength || 0} Hired</span>
            </button>
          </div>
        </div>
        <Link
          href={'/lawyer/settings/profile'}
          className={`${
            isExpanded ? 'admin-text' : 'text-[12px]'
          } py-1 px-2 bg-[#FF8602] rounded-[5px] text-white hover:bg-[#FF8602] transition-all flex items-center gap-2`}
        >
          <span>All</span>
        </Link>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-3 mb-3 gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[#34495E]">
          <div className="lg:flex items-center gap-2">
            {hasActiveFilters && (
              <div
                className="text-[#C72C41] text-[11px] flex items-center gap-2"
                onClick={() => {
                  setResponses([]);
                  localStorage.removeItem('responseFilters');
                  setQueryParams({
                    page: 1,
                    limit: 10,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                    keyword: '',
                    spotlight: '',
                    clientActions: '',
                    actionsTaken: '',
                    leadSubmission: '',
                  });
                  clearFilters();
                }}
              >
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
                text={`Urgent(${urgent})`}
                bgColor="#EF8D32"
                textColor="text-[#fff]"
                fontSize={isExpanded ? 'text-[12px]' : 'text-[10px]'}
                rounded="rounded-[5px]"
              />
            </div>
          </div>
        </div>

        <FilterResponseSidebar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setResponses={setResponses}
          setSelectedResponseId={setSelectedResponseId}
          searchParams={searchParams}
        />
      </div>

      <hr className="w-full bg-[#F3F3F3] h-[1px]" />
    </section>
  );
}
