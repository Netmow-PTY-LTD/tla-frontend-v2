'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const [responses, setResponses] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const router = useRouter();
  const scrollContainerRef = useRef(null);

  const [queryParams, setQueryParams] = useState(() => {
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

  useEffect(() => {
    localStorage.setItem('responseFilters', JSON.stringify(queryParams));
  }, [queryParams]);



  const {
    data: allMyResponses,
    isLoading: isAllMyResponsesLoading,
    isFetching,
    refetch
  } = useGetAllMyResponsesQuery(queryParams);


  // Prevent scroll when in this route
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
    if (queryParams.page === 1 && allMyResponses?.data) {
      setResponses(allMyResponses.data);
      if (allMyResponses.data.length > 0) {
        setSelectedResponse(allMyResponses.data[0]);
      }
    } else if (queryParams.page > 1 && allMyResponses?.data) {
      setResponses((prev) => [...prev, ...allMyResponses.data]);
    }

    // Update hasMore
    const totalPage = allMyResponses?.pagination?.totalPage;
    if (!totalPage || queryParams.page >= totalPage) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

  
  }, [allMyResponses, queryParams]);





  //  ------------------------- Infinite scroll ----------------------------
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (nearBottom && hasMore && !isFetching) {
        setQueryParams((prev) => ({
          ...prev,
          page: prev.page + 1,
        }));
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetching]);



// Set selectedResponse whenever responses update
useEffect(() => {
  if (responses.length > 0) {
    setSelectedResponse(responses[0]);
  } else {
    setSelectedResponse(null);
  }
}, [responses]);






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
          {showResponseDetails && selectedResponse && (
            <div className="left-column-8">
              <div className="column-wrap-left">
                <MyResponseDetails
                  response={selectedResponse}
                  responseId={responseId}
                  onBack={() => setShowResponseDetails(false)}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          <div className={showResponseDetails ? 'right-column-4' : 'right-column-full'}>
            <div className="column-wrap-right" ref={scrollContainerRef}>
              <div className="leads-top-row">
                <ResponseHead
                  isExpanded={!showResponseDetails}
                  allResponse={allMyResponses || {}}
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                  scrollContainerRef={scrollContainerRef}
                  refetch={refetch}

                />
              </div>

              <div className="leads-bottom-row max-w-[1400px] mx-auto">
                <LeadsRight
                  isExpanded={!showResponseDetails}
                  onViewDetails={(response) => {
                    setSelectedResponse(response);
                    setShowResponseDetails(true);
                  }}
                  data={responses}
                  setIsLoading={setIsLoading}
                />
                {hasMore && (
                  <div className="py-6 text-center">
                    <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                  </div>
                )}
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





