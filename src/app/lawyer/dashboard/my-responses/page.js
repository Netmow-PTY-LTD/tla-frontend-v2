'use client';
import React, { useEffect, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import MyResponseDetails from './_components/MyResponseDetails';
import ResponseHead from './_components/ResponseHead';
import {
  useGetAllMyResponsesQuery,
  useGetSingleResponseQuery,
} from '@/store/features/lawyer/ResponseApiService';
import { Inbox, Loader, Loader2 } from 'lucide-react';
import LeadsRight from './_components/ResponsesList';
import { Skeleton } from '@/components/ui/skeleton';

const MyResponsePage = () => {
  const [showResponseDetails, setShowResponseDetails] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');

  //console.log('responseId', responseId);

  const router = useRouter();

  const { data: allMyResponses, isLoading: isAllMyResponsesLoading } =
    useGetAllMyResponsesQuery();

  console.log('selectedResponse', selectedResponse);

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
  }, [allMyResponses?.data]);

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
          {showResponseDetails && (
            <div className="left-column-7">
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
            className={`${
              showResponseDetails ? 'right-column-5 ' : 'right-column-full'
            }`}
          >
            <div className="column-wrap-right">
              <div className="leads-top-row">
                <ResponseHead isExpanded={!showResponseDetails} />
              </div>
              <div className="leads-bottom-row">
                <LeadsRight
                  isExpanded={!showResponseDetails}
                  onViewDetails={(response) => {
                    setSelectedResponse(response);
                    setShowResponseDetails(true);
                    router.push(`?responseId=${response?._id}`);
                  }}
                  data={allMyResponses?.data}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Inbox className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="italic text-[18px] text-gray-500">
            Currently you have no responses.
          </h4>
        </div>
      )}
    </div>
  );
};

export default MyResponsePage;
