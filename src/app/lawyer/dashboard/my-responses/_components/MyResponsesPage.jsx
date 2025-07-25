'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useGetAllMyResponsesQuery } from '@/store/features/lawyer/ResponseApiService';
import { Inbox, Loader, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MyResponseDetails from './MyResponseDetails';
import ResponseHead from './ResponseHead';
import LeadsRight from './ResponsesList';
import { Button } from '@/components/ui/button';

export default function MyResponsesPage() {
  const [showResponseDetails, setShowResponseDetails] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const [queryParams, setQueryParams] = useState(() => {
    // Load filters from localStorage on initial render
    const saved = localStorage.getItem('responseFilters');
    return saved
      ? JSON.parse(saved)
      : {
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
  });

  // Save filters to localStorage whenever queryParams change
  useEffect(() => {
    localStorage.setItem('responseFilters', JSON.stringify(queryParams));
  }, [queryParams]);


  const router = useRouter();

  const { data: allMyResponses, isLoading: isAllMyResponsesLoading } =
    useGetAllMyResponsesQuery(queryParams);

  // Handle body scroll and layout overflow
  useEffect(() => {
    const cleanPathname = pathname?.trim().replace(/\/+$/, '');

    if (cleanPathname === '/lawyer/dashboard/my-responses') {
      window.scrollTo({ top: 0, behavior: 'auto' });

      document.body.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname]);

  useEffect(() => {
    if (allMyResponses?.data?.length > 0) {
      setSelectedResponse(allMyResponses?.data[0]);
    }
  }, [allMyResponses?.data,queryParams]);

  // if (isAllMyResponsesLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <span className="flex items-center justify-center gap-2 text-[14px]">
  //         <Loader2 className="w-10 h-10 animate-spin" />
  //         loading...
  //       </span>
  //     </div>
  //   );
  // }

  if (isAllMyResponsesLoading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        {/* Header section */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Content blocks */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Avatar skeleton */}
            <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
            {/* Text block */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}

        {/* Table or card-like block */}
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-1/3" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lead-board-wrap">
      {allMyResponses?.data && allMyResponses?.data?.length > 0 ? (
        <div className="lead-board-container">
          {showResponseDetails && selectedResponse && (
            <div className="left-column-8">
              <div className="column-wrap-left">
                <MyResponseDetails
                  response={selectedResponse}
                  responseId={responseId}
                  onBack={() => setShowResponseDetails(false)}
                />
              </div>
            </div>
          )}

          <div
            className={`${showResponseDetails ? 'right-column-4 ' : 'right-column-full'
              }`}
          >
            <div className="column-wrap-right">
              <div className="leads-top-row">
                <ResponseHead
                  isExpanded={!showResponseDetails}
                  data={allMyResponses?.data || []}
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}

                />
              </div>
              <div className="leads-bottom-row max-w-[1400px] mx-auto">
                <LeadsRight
                  isExpanded={!showResponseDetails}
                  onViewDetails={(response) => {
                    setSelectedResponse(response);
                    setShowResponseDetails(true);
                    router.push(`?responseId=${response?._id}`);
                  }}
                  data={allMyResponses?.data || []}

                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Inbox className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="italic text-[18px] text-gray-500">
            Currently there are no leads.
          </h4>
          <Button
            className="mt-4"
            onClick={() => {
              localStorage.removeItem('responseFilters');
              window.location.href = '/lawyer/dashboard/my-responses';
            }}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
