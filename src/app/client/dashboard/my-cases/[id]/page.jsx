'use client';
import LawyerCard from '@/app/client/_components/LawyerCard';
import LeadResponseCard from '@/app/client/_components/LeadResponseCard';
import LeadResponseDetails from '@/app/client/_components/LeadResponseDetails';
import LeadsHead from '@/app/lawyer/dashboard/_component/LeadsHead';
import LeadsRight from '@/app/lawyer/dashboard/_component/LeadsRight';
import ResponseSkeleton from '@/app/lawyer/dashboard/my-responses/_components/ResponseSkeleton';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { data, userDummyImage } from '@/data/data';
import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
import { useRealTimeStatus } from '@/hooks/useSocketListener';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useGetAllServiceWiseLawyersSuggestionsQuery } from '@/store/features/client/ClientApiServices';
import { useGetAllLeadWiseResponsesQuery } from '@/store/features/client/LeadsApiService';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import { verifyToken } from '@/utils/verifyToken';
import Cookies from 'js-cookie';
import {
  AtSign,
  BadgeCheck,
  CircleAlert,
  Loader,
  MoveLeft,
  PhoneOutgoing,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export default function LeadDetailsPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [showLeadResponseDetails, setShowLeadResponseDetails] = useState(true);
  const [selectedLeadResponse, setSelectedLeadResponse] = useState(null);
  const currentUserId = useSelector(selectCurrentUser)?._id;
  const [onlineMap, setOnlineMap] = useState({});
  //const [tabValue, setTabValue] = useState('find-lawyers');
  const [isMobile, setIsMobile] = useState(false);
  const [lawyers, setLawyers] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [totalLawyersCount, setTotalLawyersCount] = useState(0);
  const [lawyerOnlineStatus, setLawyerOnlineStatus] = useState({});
  const [minRating, setMinRating] = useState(null);
  const [activeTab, setActiveTab] = useState('matched-lawyers');
  const [sortOrder, setSortOrder] = useState('asc');

  const LIMIT = '10';

  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;

  const { data: singleLead, isLoading: isSingleLeadLoading } =
    useGetSingleLeadQuery(id, {
      skip: !id,
    });

  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const maxLength = 300;

  useEffect(() => {
    // Scroll to top of the window when this component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const fullText =
    singleLead?.data?.additionalDetails === ''
      ? `If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance. If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance.`
      : singleLead?.data?.additionalDetails;

  const getTruncatedText = (text, maxLength) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const shouldTruncate = fullText?.length > maxLength;
  const displayText =
    isExpanded || !shouldTruncate
      ? fullText
      : getTruncatedText(fullText, maxLength);

  const { data: leadWiseResponses, isLoading: isSingleLeadResponseLoading } =
    useGetAllLeadWiseResponsesQuery(id);

  // useEffect(() => {
  //   if (leadWiseResponses?.data?.length > 0) {
  //     setTabValue('responded-lawyers');
  //   }
  // }, [leadWiseResponses?.data?.length]);

  useEffect(() => {
    const statusParam = searchParams.get('status') || '';
    const tabParam = searchParams.get('tab') || '';
    const responseIdParam = searchParams.get('responseId') || '';

    if (statusParam?.toLowerCase().trim() === 'hired') {
      setActiveTab('responded-lawyers'); // auto-select responded tab

      const hiredResponse = leadWiseResponses?.data?.find(
        (res) => res.status?.toLowerCase().trim() === 'hired'
      );

      if (hiredResponse) {
        setSelectedLeadResponse(hiredResponse);
        setShowLeadResponseDetails(true);
      }
    } else if (tabParam === 'responded-lawyers') {
      setActiveTab('responded-lawyers');

      //  ----------------------- 126nl it will be change in future for better user experience  -------------------
      if (responseIdParam) {
        const targetResponse = leadWiseResponses?.data?.find(
          (res) => res._id === responseIdParam
        );

        if (targetResponse) {
          setSelectedLeadResponse(targetResponse);
          setShowLeadResponseDetails(true);
        }
      }
    } else if (tabParam === 'matched-lawyers') {
      setActiveTab('matched-lawyers');
    }
  }, [searchParams, leadWiseResponses?.data]);

  //  ----------- user online offline ---------------------

  // Safely extract user IDs from AllLeadData
  const userIds =
    leadWiseResponses?.data?.map(
      (response) => response?.responseBy?.user?._id
    ) || [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, userIds, (userId, isOnline) => {
    setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
  });

  //  ----------- Lawyers suggestion api call ---------------------

  const serviceId = singleLead?.data?.serviceId?._id;

  const leadId = singleLead?.data?._id;

  const {
    data: lawyersData,
    isLoading: isLawyersLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetAllServiceWiseLawyersSuggestionsQuery(
    { page, LIMIT, serviceId, leadId, minRating, sortOrder },
    {
      skip: !serviceId || !leadId,
    }
  );

  console.log('sortOrder', sortOrder);

  useEffect(() => {
    setPage(1);
    setLawyers([]);
  }, [minRating]);

  useEffect(() => {
    if (lawyersData && lawyersData?.data?.length > 0) {
      const currentPage = lawyersData?.pagination?.page ?? 1;

      setLawyers((prev) => {
        if (currentPage === 1) {
          // first page → replace completely
          return lawyersData.data;
        } else {
          // append new results (avoid duplicates by _id)
          const existingIds = new Set(prev.map((l) => l._id));
          const newItems = lawyersData?.data?.filter(
            (l) => !existingIds.has(l._id)
          );
          return [...prev, ...newItems];
        }
      });

      setTotalPages(lawyersData?.pagination?.totalPage);
      setTotalLawyersCount(lawyersData?.pagination?.total);
    }
  }, [lawyersData]);

  //console.log('lawyers', lawyers);

  const lawyerIds = lawyersData?.data?.map((lawyer) => lawyer?._id) || [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, lawyerIds, (userId, isOnline) => {
    setLawyerOnlineStatus((prev) => ({ ...prev, [userId]: isOnline }));
  });

  //infinite scrolling

  // const loaderRef = useRef(null);

  const loaderRef = useCallback(
    (node) => {
      if (!node || activeTab !== 'matched-lawyers') return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !isFetching) {
            if (totalPages && page < totalPages) {
              setPage((prevPage) => prevPage + 1);
            }
          }
        },
        {
          root: null,
          threshold: 1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    },
    [activeTab, isFetching, totalPages]
  );

  console.log('Lawyers ==> ', lawyers);

  console.log({ page, isFetching, totalPages });

  const handleShowLeadResponseDetails = (response) => {
    setSelectedLeadResponse(response);
    setShowLeadResponseDetails(true);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('responseId', response._id);
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setIsMobile(window.innerWidth <= 1280);
  }, []);

  //console.log('singleLead ==>', singleLead);

  if (isSingleLeadLoading) {
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
    <div className="lead-board-wraps">
      <div className="lead-board-containers">
        <div className={`w-full`}>
          <div className="rounded-lg md:p-5 sticky top-[100px]">
            <div className="max-w-full">
              <div className="flex items-center justify-between">
                <Link
                  className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all duration-200 px-3 py-1.5 -ml-3 rounded-lg hover:bg-gray-100/50"
                  href="/client/dashboard/my-cases?redirect=false"
                >
                  <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" />
                  <span className="font-semibold text-sm tracking-tight">Back to my cases</span>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="">
                  <h5 className="font-semibold mb-2 text-2xl">
                    {singleLead?.data?.serviceId?.name ?? ''}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`w-full`}>
          <div className="max-w-[1000px] mx-auto">
            <div className="flex w-full flex-col gap-6">
              <Tabs
                //defaultValue="matched-lawyers"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full justify-center gap-2 pb-4 border-b border-gray-200">
                  <TabsTrigger
                    value="matched-lawyers"
                    className="border border-gray-200"
                  >
                    Matched Lawyers ({totalLawyersCount ?? 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="responded-lawyers"
                    className="border border-gray-300 shadow-none"
                  >
                    Responses ({leadWiseResponses?.data?.length ?? 0})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="responded-lawyers">
                  {isSingleLeadResponseLoading ? (
                    <ResponseSkeleton />
                  ) : (
                    <>
                      <div className="leads-top-row">
                        {/* <h2
                          className={`font-bold heading-base text-[#0B1C2D] text-left`}
                        >
                          Lawyers who responded
                        </h2> */}
                      </div>
                      <hr className="bg-[#F3F3F3] h-1 w-full my-2" />
                      {showLeadResponseDetails && selectedLeadResponse ? (
                        <LeadResponseDetails
                          onBack={() => setShowLeadResponseDetails(false)}
                          response={selectedLeadResponse}
                          onlineMap={onlineMap}
                        />
                      ) : (
                        <div className="leads-bottom-row">
                          <div className={`grid grid-cols-1 gap-y-4`}>
                            {leadWiseResponses?.data?.map((response, i) => (
                              <LeadResponseCard
                                key={i}
                                response={response}
                                isExpanded={isExpanded}
                                onlineMap={onlineMap}
                                handleShowLeadResponseDetails={
                                  handleShowLeadResponseDetails
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
                <TabsContent value="matched-lawyers">
                  <div className="my-3">
                    <div className="flex flex-wrap justify-between mb-5 gap-4 border-b border-gray-400 pt-2 pb-5">
                      <div className="flex flex-wrap gap-2 items-center">
                        <Select
                          value={
                            minRating === null || minRating === undefined
                              ? 'all' // ✅ Default to "All Ratings"
                              : String(minRating) // ✅ Safely convert number to string
                          }
                          onValueChange={(value) => {
                            if (value === 'all') {
                              setMinRating(null); // ✅ No rating filter applied
                            } else {
                              setMinRating(Number(value)); // ✅ Set numeric rating
                            }
                          }}
                        >
                          <SelectTrigger className="w-[200px] bg-white">
                            <SelectValue placeholder="All Ratings" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Ratings</SelectLabel>
                              <SelectItem value="all">All Ratings</SelectItem>
                              <SelectItem value="1">1 star</SelectItem>
                              <SelectItem value="2">2 stars</SelectItem>
                              <SelectItem value="3">3 stars</SelectItem>
                              <SelectItem value="4">4 stars</SelectItem>
                              <SelectItem value="5">5 stars</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <h4 className="font-medium heading-md text-center">
                          Total {totalLawyersCount}{' '}
                          {totalLawyersCount === 1 ? 'match' : 'matches'}
                        </h4>
                      </div>
                      <Select
                        value={sortOrder}
                        onValueChange={(value) => setSortOrder(value)}
                      >
                        <SelectTrigger className="w-[200px] bg-white">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="asc">
                              Sort By: Ascending
                            </SelectItem>
                            <SelectItem value="desc">
                              Sort By: Descending
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {!isFetching && totalLawyersCount === 0 ? (
                      <p className="text-center text-gray-500 text-sm">
                        Currently there is no matched lawyer
                      </p>
                    ) : (
                      <div
                        className="flex flex-col gap-5"
                        id="scroll-target-for-data"
                      >
                        {lawyers?.map((lawyer, i) => (
                          <LawyerCard
                            key={i}
                            lawyer={lawyer}
                            id={id}
                            lawyerOnlineStatus={lawyerOnlineStatus}
                            refetch={refetch}
                            isHiredLead={singleLead?.data?.isHired}
                            isClosed={singleLead?.data?.isClosed}
                          />
                        ))}

                        {/* Only show loader when fetching AND there are already some lawyers */}
                        <div
                          ref={loaderRef}
                          className="h-10 flex items-center justify-center"
                        >
                          {isFetching && (
                            <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
