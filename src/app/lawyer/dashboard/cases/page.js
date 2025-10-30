'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
} from '@/store/features/lawyer/LeadsApiService';
import ResponseSkeleton from '../my-responses/_components/ResponseSkeleton';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsHead from '../_component/LeadsHead';
import LeadsRight from '../_component/LeadsRight';
import { Inbox, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const LIMIT = '100';

const LeadsBoardPage = () => {
  const [showLeadDetails, setShowLeadDetails] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [parsed, setParsed] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(parsed || {});
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  // --- Skeleton loader control ---
  const [forceSkeleton, setForceSkeleton] = useState(true);
  const skeletonTimerRef = useRef(null);

  // workable code
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  // Load filter from localStorage on first mount

  useEffect(() => {
    const stored = localStorage.getItem('lead-filters');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setParsed(parsedData);
        setSearchKeyword({ ...parsedData }); // <-- Set it here
      } catch (err) {
        console.error('Invalid JSON in localStorage:', err);
      }
    } else {
      setSearchKeyword({});
    }
  }, []);

  //console.log('searchKeyword', searchKeyword);

  useEffect(() => {
    setPage(1);
    //setLeads([]);
    //setSelectedLead(null); // reset selection so first item can be auto-selected
  }, [searchKeyword]);

  const {
    data,
    isLoading: isAllLeadsLoading,
    isFetching,
    refetch: refetchAllLeads,
  } = useGetAllLeadsQuery({
    page,
    limit: LIMIT,
    searchKeyword: JSON.stringify(searchKeyword || {}),
  });

  console.log('data', data);

  const loader = useRef(null);

  // Append new data to existing list
  // useEffect(() => {

  //   if (data && Array.isArray(data?.data) && data.data.length > 0) {
  //     const currentPage = data?.pagination?.page ?? 1;

  //     setLeads((prev) => {
  //       if (currentPage === 1) {
  //         // reset list on first page (new filter or reload)
  //         return data.data;
  //       }

  //       // append new items, skip duplicates by _id
  //       const existingIds = new Set(prev.map((lead) => lead._id));
  //       const uniqueNew = data.data.filter(
  //         (lead) => !existingIds.has(lead._id)
  //       );
  //       return [...prev, ...uniqueNew];

  //     });

  //     setTotalPages(data?.pagination?.totalPage);
  //     setTotalLeadsCount(data?.pagination?.total);
  //   }
  // }, [data]);

  useEffect(() => {
    if (!data) return;

    const currentPage = data?.pagination?.page ?? 1;
    const newLeads = Array.isArray(data?.data) ? data.data : [];

    setLeads((prev) => {
      // Always reset leads when on first page
      if (currentPage === 1) {
        return newLeads;
      }

      //  If no new leads on next pages, just keep old ones
      if (newLeads.length === 0) {
        return prev;
      }

      //  Remove duplicates based on `_id`
      const existingIds = new Set(prev.map((lead) => lead._id));
      const uniqueNew = newLeads.filter((lead) => !existingIds.has(lead._id));

      return [...prev, ...uniqueNew];
    });

    //  Always update pagination & total counts
    setTotalPages(data?.pagination?.totalPage || 1);
    setTotalLeadsCount(data?.pagination?.total || 0);
  }, [data]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const scrollTarget = document.getElementById('scroll-target-for-data');
    if (!scrollTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching) {
          if (totalPages && page >= totalPages) return;
          setPage((prevPage) => prevPage + 1);
        }
      },
      { root: scrollTarget, threshold: 1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [page, isFetching, totalPages, leads]);

  // console.log({ page, isFetching, totalPages });
  // console.log('leads', leads);

  useEffect(() => {
    if (leads?.length > 0) {
      // If selectedLead is not in the new leads list, select the first one
      const stillExists =
        selectedLead && leads.some((l) => l._id === selectedLead._id);
      if (!stillExists) {
        setSelectedLead(leads[0]);
      }
      // else: keep the current selectedLead
    } else {
      setSelectedLead(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, searchKeyword]);

  // Fetch detailed data for selected lead
  const { data: selectedLeadData, isLoading: isSingleLeadLoading } =
    useGetSingleLeadQuery(selectedLead?._id, { skip: !selectedLead?._id });

  //console.log('leads', leads);

  // if (isAllLeadsLoading) {
  //   return (
  //     <div className="p-6 space-y-8 animate-pulse">
  //       {/* Header section */}
  //       <div className="space-y-3">
  //         <Skeleton className="h-8 w-1/2" />
  //         <Skeleton className="h-4 w-1/3" />
  //       </div>

  //       {/* Content blocks */}
  //       {Array.from({ length: 5 }).map((_, idx) => (
  //         <div key={idx} className="flex gap-4">
  //           {/* Avatar skeleton */}
  //           <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
  //           {/* Text block */}
  //           <div className="flex-1 space-y-2">
  //             <Skeleton className="h-4 w-3/4" />
  //             <Skeleton className="h-4 w-2/3" />
  //             <Skeleton className="h-4 w-1/2" />
  //           </div>
  //         </div>
  //       ))}

  //       {/* Table or card-like block */}
  //       <div className="space-y-4 mt-8">
  //         <Skeleton className="h-6 w-1/3" />
  //         {Array.from({ length: 4 }).map((_, idx) => (
  //           <div key={idx} className="flex gap-4 items-center">
  //             <Skeleton className="h-4 w-1/6" />
  //             <Skeleton className="h-4 w-1/4" />
  //             <Skeleton className="h-4 w-1/2" />
  //             <Skeleton className="h-4 w-1/5" />
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <>
      <div className="lead-board-wrap">
        {isFetching || isAllLeadsLoading ? (
          <div className="p-6 space-y-8 animate-pulse">
            {/* Header section */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>

            {/* Content blocks */}
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
        ) : leads?.length > 0 ? (
          <div className="lead-board-container">
            {showLeadDetails && selectedLead && (
              <div className="left-column-8">
                {
                  <div className="column-wrap-left bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
                    <LeadDetailsPage
                      lead={selectedLead}
                      onBack={() => setShowLeadDetails(false)}
                      singleLead={selectedLeadData?.data}
                      isSingleLeadLoading={isSingleLeadLoading}
                      data={leads}
                      forceSkeleton={forceSkeleton}
                      onSkeletonFinish={() => {
                        // Always show skeleton for at least 3 seconds, reset timer on every click
                        if (skeletonTimerRef.current) {
                          clearTimeout(skeletonTimerRef.current);
                        }
                        skeletonTimerRef.current = setTimeout(() => {
                          setForceSkeleton(false);
                        }, 1200);
                      }}
                    />
                  </div>
                }
              </div>
            )}
            <div
              className={`${
                showLeadDetails ? 'right-column-4 ' : 'right-column-full'
              }`}
            >
              <div className="column-wrap-right" id="scroll-target-for-data">
                <div className="leads-top-row">
                  <LeadsHead
                    isExpanded={!showLeadDetails}
                    total={totalLeadsCount}
                    setSearchKeyword={setSearchKeyword}
                    searchKeyword={searchKeyword}
                    setLeads={setLeads}
                    setSelectedLead={setSelectedLead}
                    leads={leads}
                    page={page}
                    setPage={setPage}
                    urgent={data?.counts?.urgent || 0}
                  />
                </div>
                <div className="leads-bottom-row max-w-[1400px] mx-auto">
                  <LeadsRight
                    isExpanded={!showLeadDetails}
                    onViewDetails={(lead) => {
                      setSelectedLead(lead);
                      setShowLeadDetails(true);
                    }}
                    data={leads ?? []}
                    selectedLead={selectedLead}
                  />
                </div>
                <div ref={loader}>
                  {isFetching && (
                    <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <Inbox className="w-12 h-12 mb-4 text-gray-400" />
            <h4 className="italic text-[18px] text-gray-500">
              Currently there are no cases.
            </h4>
            <Button
              className="mt-4"
              onClick={() => {
                localStorage.removeItem('lead-filters');
                window.location.href = '/lawyer/dashboard/cases';
              }}
            >
              Reload
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default LeadsBoardPage;

//  mb-code
// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   useGetAllLeadsQuery,
//   useGetSingleLeadQuery,
// } from '@/store/features/lawyer/LeadsApiService';
// import ResponseSkeleton from '../my-responses/_components/ResponseSkeleton';
// import LeadDetailsPage from '../_component/LeadsLeft';
// import LeadsHead from '../_component/LeadsHead';
// import LeadsRight from '../_component/LeadsRight';
// import { Inbox, Loader } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';

// const LIMIT = '10';

// const LeadsBoardPage = () => {
//   const [showLeadDetails, setShowLeadDetails] = useState(true);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [leads, setLeads] = useState([]);
//   const [parsed, setParsed] = useState(null);
//   const [searchKeyword, setSearchKeyword] = useState(parsed || {});
//   const [totalLeadsCount, setTotalLeadsCount] = useState(0);

//   // workable code
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(null);

//   // Load filter from localStorage on first mount

//   useEffect(() => {
//     const stored = localStorage.getItem('lead-filters');
//     if (stored) {
//       try {
//         const parsedData = JSON.parse(stored);
//         setParsed(parsedData);
//         setSearchKeyword({ ...parsedData }); // <-- Set it here
//       } catch (err) {
//         console.error('Invalid JSON in localStorage:', err);
//       }
//     } else {
//       setSearchKeyword({});
//     }
//   }, []);

//   //console.log('searchKeyword', searchKeyword);

//   useEffect(() => {
//     setPage(1);
//     //setLeads([]);
//     //setSelectedLead(null); // reset selection so first item can be auto-selected
//   }, [searchKeyword]);

//   const {
//     data,
//     isLoading: isAllLeadsLoading,
//     isFetching,
//     refetch: refetchAllLeads,
//   } = useGetAllLeadsQuery({
//     page,
//     limit: LIMIT,
//     searchKeyword: JSON.stringify(searchKeyword || {}),
//   });

//   console.log('data', data);

//   const loader = useRef(null);

//   // Append new data to existing list
//   useEffect(() => {
//     if (data && Array.isArray(data?.data) && data.data.length > 0) {
//       const currentPage = data?.pagination?.page ?? 1;

//       setLeads((prev) => {
//         if (currentPage === 1) {
//           // reset list on first page (new filter or reload)
//           return data.data;
//         }

//         // append new items, skip duplicates by _id
//         const existingIds = new Set(prev.map((lead) => lead._id));
//         const uniqueNew = data.data.filter(
//           (lead) => !existingIds.has(lead._id)
//         );
//         return [...prev, ...uniqueNew];
//       });

//       setTotalPages(data?.pagination?.totalPage);
//       setTotalLeadsCount(data?.pagination?.total);
//     }
//   }, [data]);

//   // Infinite scroll intersection observer
//   useEffect(() => {
//     const scrollTarget = document.getElementById('scroll-target-for-data');
//     if (!scrollTarget) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];
//         if (entry.isIntersecting && !isFetching) {
//           if (totalPages && page >= totalPages) return;
//           setPage((prevPage) => prevPage + 1);
//         }
//       },
//       { root: scrollTarget, threshold: 1 }
//     );

//     const currentLoader = loader.current;
//     if (currentLoader) observer.observe(currentLoader);

//     return () => {
//       if (currentLoader) observer.unobserve(currentLoader);
//     };
//   }, [page, isFetching, totalPages, leads]);

//   // console.log({ page, isFetching, totalPages });
//   // console.log('leads', leads);

//   useEffect(() => {
//     if (leads?.length > 0) {
//       setSelectedLead(leads[0]);
//     } else {
//       setSelectedLead(null);
//     }
//   }, [leads, searchKeyword]);

//   // Fetch detailed data for selected lead
//   const { data: selectedLeadData, isLoading: isSingleLeadLoading } =
//     useGetSingleLeadQuery(selectedLead?._id, { skip: !selectedLead?._id });

//   //console.log('leads', leads);

//   if (isAllLeadsLoading) {
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
//     <>
//       <div className="lead-board-wrap">
//         {leads?.length > 0 ? (
//           <div className="lead-board-container">
//             {showLeadDetails && selectedLead && (
//               <div className="left-column-8">
//                 {isSingleLeadLoading ? (
//                   <ResponseSkeleton />
//                 ) : (
//                   <div className="column-wrap-left bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
//                     <LeadDetailsPage
//                       lead={selectedLead}
//                       onBack={() => setShowLeadDetails(false)}
//                       singleLead={selectedLeadData?.data}
//                       isSingleLeadLoading={isSingleLeadLoading}
//                       data={leads}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}
//             <div
//               className={`${
//                 showLeadDetails ? 'right-column-4 ' : 'right-column-full'
//               }`}
//             >
//               <div className="column-wrap-right" id="scroll-target-for-data">
//                 <div className="leads-top-row">
//                   <LeadsHead
//                     isExpanded={!showLeadDetails}
//                     total={totalLeadsCount}
//                     setSearchKeyword={setSearchKeyword}
//                     searchKeyword={searchKeyword}
//                     setLeads={setLeads}
//                     setSelectedLead={setSelectedLead}
//                     leads={leads}
//                     page={page}
//                     setPage={setPage}
//                     urgent={data?.counts?.urgent || 0}
//                   />
//                 </div>
//                 <div className="leads-bottom-row max-w-[1400px] mx-auto">
//                   <LeadsRight
//                     isExpanded={!showLeadDetails}
//                     onViewDetails={(lead) => {
//                       setSelectedLead(lead);
//                       setShowLeadDetails(true);
//                     }}
//                     data={leads ?? []}
//                     selectedLead={selectedLead}
//                   />
//                 </div>
//                 <div ref={loader}>
//                   {isFetching && (
//                     <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : isFetching ? (
//           <div className="p-6 space-y-8 animate-pulse">
//             {/* Header section */}
//             <div className="space-y-3">
//               <Skeleton className="h-8 w-1/2" />
//               <Skeleton className="h-4 w-1/3" />
//             </div>

//             {/* Content blocks */}
//             {Array.from({ length: 5 }).map((_, idx) => (
//               <div key={idx} className="flex gap-4">
//                 <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
//                 <div className="flex-1 space-y-2">
//                   <Skeleton className="h-4 w-3/4" />
//                   <Skeleton className="h-4 w-2/3" />
//                   <Skeleton className="h-4 w-1/2" />
//                 </div>
//               </div>
//             ))}

//             {/* Table or card-like block */}
//             <div className="space-y-4 mt-8">
//               <Skeleton className="h-6 w-1/3" />
//               {Array.from({ length: 4 }).map((_, idx) => (
//                 <div key={idx} className="flex gap-4 items-center">
//                   <Skeleton className="h-4 w-1/6" />
//                   <Skeleton className="h-4 w-1/4" />
//                   <Skeleton className="h-4 w-1/2" />
//                   <Skeleton className="h-4 w-1/5" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col justify-center items-center h-full">
//             <Inbox className="w-12 h-12 mb-4 text-gray-400" />
//             <h4 className="italic text-[18px] text-gray-500">
//               Currently there are no cases.
//             </h4>
//             <Button
//               className="mt-4"
//               onClick={() => {
//                 localStorage.removeItem('lead-filters');
//                 window.location.href = '/lawyer/dashboard/cases';
//               }}
//             >
//               Clear Search
//             </Button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default LeadsBoardPage;
