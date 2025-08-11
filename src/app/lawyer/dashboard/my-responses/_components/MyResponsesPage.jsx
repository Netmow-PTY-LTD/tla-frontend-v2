'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useGetAllMyResponsesQuery,
  useGetSingleResponseQuery,
} from '@/store/features/lawyer/ResponseApiService';
import { Inbox, Loader, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MyResponseDetails from './MyResponseDetails';
import ResponseHead from './ResponseHead';
import LeadsRight from './ResponsesList';
import { Button } from '@/components/ui/button';

export default function MyResponsesPage() {
  const [showResponseDetails, setShowResponseDetails] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [responses, setResponses] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(null);
  const [totalResponsesCount, setTotalResponsesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  let page_number = 1;

  const saved = localStorage.getItem('responseFilters');

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

  const [queryParams, setQueryParams] = useState(() => {
    if (saved) {
      const savedObj = JSON.parse(saved);

      // Remove page & limit before comparison
      const { page: _, limit: __, ...restSaved } = savedObj;
      const { page: ___, limit: ____, ...restDefault } = defaultQueryParams;

      const isSameIgnoringPageLimit =
        JSON.stringify(restSaved) === JSON.stringify(restDefault);

      return isSameIgnoringPageLimit ? defaultQueryParams : savedObj;
    }

    return defaultQueryParams;
  });

  console.log('queryParams in MyResponsesPage', queryParams);

  useEffect(() => {
    if (responseId) {
      setSelectedResponseId(responseId);
      setShowResponseDetails(true);
      localStorage.setItem('responseFilters', {
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
    }
  }, [queryParams, responseId]);

  useEffect(() => {
    localStorage.setItem('responseFilters', JSON.stringify(queryParams));
  }, [queryParams]);

  //console.log('responseFilters', responseFilters);

  const {
    data: allMyResponses,
    isLoading: isAllMyResponsesLoading,
    isFetching,
    refetch,
  } = useGetAllMyResponsesQuery(queryParams);

  const {
    data: singleResponse,
    isLoading: isSingleResponseLoading,
    refetch: singleResponseRefetch,
  } = useGetSingleResponseQuery(selectedResponseId, {
    skip: !selectedResponseId,
  });

  console.log('singleResponse in MyResponsesPage', singleResponse);

  //console.log('selectedResponseId', selectedResponseId);
  // Prevent body scroll when in this route
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

  // ------------------------ Reset responses on filter change (new search) --------------------------
  useEffect(() => {
    if (allMyResponses && allMyResponses?.data?.length > 0) {
      setResponses((prev) => [...prev, ...allMyResponses?.data]);
      setTotalPages(allMyResponses?.pagination?.totalPage);
      setTotalResponsesCount(allMyResponses?.pagination?.total);
    }
  }, [allMyResponses]);

  useEffect(() => {
    if (!responseId) {
      if (responses.length > 0) {
        setSelectedResponseId(responses[0]._id);
      }
    }
  }, [responseId, responses]);

  //console.log('Responses', responses);
  // console.log('Total responses count', totalPages);
  // console.log('page', queryParams.page);
  //console.log('selectedResponseId', selectedResponseId);

  const loader = useRef(null);

  useEffect(() => {
    const scrollTarget = document.getElementById('scroll-target-for-data');
    if (!scrollTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching) {
          if (totalPages && queryParams.page >= totalPages) return;

          setQueryParams((prev) => ({
            ...prev,
            page: prev.page + 1,
          }));
        }
      },
      { root: scrollTarget, threshold: 1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isFetching, totalPages]);

  //  ------------------------- Infinite scroll ----------------------------
  // useEffect(() => {
  //   const container = scrollContainerRef.current;
  //   if (!container) return;

  //   const handleScroll = () => {
  //     const { scrollTop, scrollHeight, clientHeight } = container;
  //     const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;

  //     if (nearBottom && hasMore && !isFetching) {
  //       // setQueryParams((prev) => ({
  //       //   ...prev,
  //       //   page: prev.page + 1,
  //       // }));
  //       setQueryParams((prev) => {
  //         const nextPage = prev.page + 1;
  //         if (allMyResponses?.pagination?.totalPage && nextPage > allMyResponses.pagination.totalPage) {
  //           return prev; // don’t update page
  //         }
  //         return { ...prev, page: nextPage };
  //       });
  //     }
  //   };

  //   container.addEventListener('scroll', handleScroll);
  //   return () => container.removeEventListener('scroll', handleScroll);
  // }, [hasMore, isFetching]);

  //console.log('selectedResponse in MyResponsesPage', selectedResponse);

  if (isAllMyResponsesLoading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
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
      {responses && responses.length > 0 ? (
        <div className="lead-board-container">
          {showResponseDetails && (
            <div className="left-column-8">
              <div className="column-wrap-left">
                <MyResponseDetails
                  //response={selectedResponse}
                  responseId={responseId}
                  onBack={() => setShowResponseDetails(false)}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  singleResponse={singleResponse}
                  isSingleResponseLoading={isSingleResponseLoading}
                  singleResponseRefetch={singleResponseRefetch}
                />
              </div>
            </div>
          )}

          <div
            className={
              showResponseDetails ? 'right-column-4' : 'right-column-full'
            }
          >
            <div className="column-wrap-right" id="scroll-target-for-data">
              <div className="leads-top-row">
                <ResponseHead
                  isExpanded={!showResponseDetails}
                  allResponse={allMyResponses || {}}
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                  scrollContainerRef={scrollContainerRef}
                  refetch={refetch}
                  setResponses={setResponses}
                  setSelectedResponseId={setSelectedResponseId}
                  searchParams={searchParams}
                />
              </div>

              <div className="leads-bottom-row max-w-[1400px] mx-auto">
                <LeadsRight
                  isExpanded={!showResponseDetails}
                  onViewDetails={(response, responseId) => {
                    setSelectedResponse(response);
                    setShowResponseDetails(true);
                    setSelectedResponseId(responseId);
                  }}
                  selectedResponse={selectedResponse}
                  data={responses || []}
                  setIsLoading={setIsLoading}
                  selectedResponseId={selectedResponseId}
                />
                <div ref={loader}>
                  {isFetching ? (
                    <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isFetching ? (
        <div className="p-6 space-y-8 animate-pulse">
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex gap-4">
              <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
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
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Inbox className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="italic text-[18px] text-gray-500">
            Currently there are no responses.
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

// 'use client';
// import React, { Suspense, useEffect, useRef, useState } from 'react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { useGetAllMyResponsesQuery } from '@/store/features/lawyer/ResponseApiService';
// import { Inbox, Loader, Loader2 } from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton';
// import MyResponseDetails from './MyResponseDetails';
// import ResponseHead from './ResponseHead';
// import LeadsRight from './ResponsesList';
// import { Button } from '@/components/ui/button';

// export default function MyResponsesPage() {
//   const [showResponseDetails, setShowResponseDetails] = useState(true);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [responses, setResponses] = useState([]);
//   const [totalResponsesCount, setTotalResponsesCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const responseId = searchParams.get('responseId');
//   const router = useRouter();
//   const [queryParams, setQueryParams] = useState(() => {
//     // Load filters from localStorage on initial render
//     const saved = localStorage.getItem('responseFilters');
//     return saved
//       ? JSON.parse(saved)
//       : {
//           page: 1,
//           limit: 10,
//           sortBy: 'createdAt',
//           sortOrder: 'desc',
//           keyword: '',
//           spotlight: '',
//           clientActions: '',
//           actionsTaken: '',
//           leadSubmission: '',
//         };
//   });

//   //console.log('queryParams', queryParams);

//   const scrollContainerRef = useRef(null);

//   // Save filters to localStorage whenever queryParams change
//   useEffect(() => {
//     localStorage.setItem('responseFilters', JSON.stringify(queryParams));
//   }, [queryParams]);

//   const {
//     data: allMyResponses,
//     isLoading: isAllMyResponsesLoading,
//     isFetching,
//   } = useGetAllMyResponsesQuery(queryParams);

//   console.log('allMyResponses', allMyResponses);
//   // Handle body scroll and layout overflow
//   useEffect(() => {
//     const cleanPathname = pathname?.trim().replace(/\/+$/, '');

//     if (cleanPathname === '/lawyer/dashboard/my-responses') {
//       window.scrollTo({ top: 0, behavior: 'auto' });

//       document.body.style.setProperty('overflow', 'hidden', 'important');
//     } else {
//       document.body.style.overflow = '';
//     }

//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [pathname]);

//   // useEffect(() => {
//   //   if (allMyResponses?.data?.length > 0) {
//   //     setSelectedResponse(allMyResponses?.data[0]);
//   //   }
//   // }, [allMyResponses?.data, queryParams]);

//   useEffect(() => {
//     setPage(1);
//   }, [queryParams]);

//   useEffect(() => {
//     if (!allMyResponses) return;

//     setResponses((prev) => {
//       const updatedResponses =
//         page === 1 ? allMyResponses?.data : [...prev, ...allMyResponses?.data];
//       // Automatically select the first lead when page = 1 (new filter)
//       if (page === 1 && updatedResponses?.length > 0) {
//         setSelectedResponse(updatedResponses[0]);
//       }
//       return updatedResponses;
//     });

//     if (page === 1 && typeof allMyResponses?.pagination?.total === 'number') {
//       setTotalResponsesCount(allMyResponses?.pagination?.total);
//     }

//     const totalPage = allMyResponses?.pagination?.totalPage;
//     if (
//       typeof totalPage !== 'number' ||
//       totalPage <= 0 ||
//       typeof totalPage == 'undefined' ||
//       totalPage == null
//     ) {
//       setHasMore(false);
//     } else {
//       setHasMore(page < totalPage);
//     }
//   }, [allMyResponses?.data, page]);

//   console.log('page number count ==>',page)
//   // Scroll event handler for infinite loading
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = container;
//       const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;
//       console.log('scroll exicute ==>')
//       if (nearBottom && hasMore && !isFetching) {
//         setPage((prev) => prev + 1);
//       }
//     };

//     container.addEventListener('scroll', handleScroll);

//     return () => {
//       container.removeEventListener('scroll', handleScroll);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [hasMore, isFetching, scrollContainerRef?.current]);

//   // console.log({
//   //   page,
//   //   hasMore: scrollContainerRef.current,
//   //   isFetching,
//   // });

//   // if (isAllMyResponsesLoading) {
//   //   return (
//   //     <div className="flex items-center justify-center h-screen">
//   //       <span className="flex items-center justify-center gap-2 text-[14px]">
//   //         <Loader2 className="w-10 h-10 animate-spin" />
//   //         loading...
//   //       </span>
//   //     </div>
//   //   );
//   // }

//   if (isAllMyResponsesLoading) {
//     return (
//       <div className="p-6 space-y-8 animate-pulse">
//         {/* Header section */}
//         <div className="space-y-3">
//           <Skeleton className="h-8 w-1/2" />
//           <Skeleton className="h-4 w-1/3" />
//         </div>

//         {/* Content blocks */}
//         {Array.from({ length: 5 }).map((_, idx) => (
//           <div key={idx} className="flex gap-4">
//             {/* Avatar skeleton */}
//             <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
//             {/* Text block */}
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-3/4" />
//               <Skeleton className="h-4 w-2/3" />
//               <Skeleton className="h-4 w-1/2" />
//             </div>
//           </div>
//         ))}

//         {/* Table or card-like block */}
//         <div className="space-y-4 mt-8">
//           <Skeleton className="h-6 w-1/3" />
//           {Array.from({ length: 4 }).map((_, idx) => (
//             <div key={idx} className="flex gap-4 items-center">
//               <Skeleton className="h-4 w-1/6" />
//               <Skeleton className="h-4 w-1/4" />
//               <Skeleton className="h-4 w-1/2" />
//               <Skeleton className="h-4 w-1/5" />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="lead-board-wrap">
//       {responses && responses?.length > 0 ? (
//         <div className="lead-board-container">
//           {showResponseDetails && selectedResponse && (
//             <div className="left-column-8">
//               <div className="column-wrap-left">
//                 <MyResponseDetails
//                   response={selectedResponse}
//                   responseId={responseId}
//                   onBack={() => setShowResponseDetails(false)}
//                   setIsLoading={setIsLoading}
//                   isLoading={isLoading}
//                 />
//               </div>
//             </div>
//           )}

//           <div
//             className={`${
//               showResponseDetails ? 'right-column-4 ' : 'right-column-full'
//             }`}
//           >
//             <div className="column-wrap-right" ref={scrollContainerRef}>
//               <div className="leads-top-row">
//                 <ResponseHead
//                   isExpanded={!showResponseDetails}
//                   data={allMyResponses?.data || []}
//                   queryParams={queryParams}
//                   setQueryParams={setQueryParams}
//                   total={allMyResponses?.pagination?.total || 0}
//                 />
//               </div>
//               <div className="leads-bottom-row max-w-[1400px] mx-auto">
//                 <LeadsRight
//                   isExpanded={!showResponseDetails}
//                   onViewDetails={(response) => {
//                     setSelectedResponse(response);
//                     setShowResponseDetails(true);
//                   }}
//                   data={responses || []}
//                   setIsLoading={setIsLoading}
//                 />
//                 {hasMore && (
//                   <div className="py-6 text-center">
//                     <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col justify-center items-center h-full">
//           <Inbox className="w-12 h-12 mb-4 text-gray-400" />
//           <h4 className="italic text-[18px] text-gray-500">
//             Currently there are no leads.
//           </h4>
//           <Button
//             className="mt-4"
//             onClick={() => {
//               localStorage.removeItem('responseFilters');
//               window.location.href = '/lawyer/dashboard/my-responses';
//             }}
//           >
//             Clear Search
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
