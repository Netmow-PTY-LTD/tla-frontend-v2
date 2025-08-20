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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { data, userDummyImage } from '@/data/data';
import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
import { checkValidity } from '@/helpers/validityCheck';
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
import { useParams } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export default function LeadDetailsPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [showLeadResponseDetails, setShowLeadResponseDetails] = useState(true);
  const [selectedLeadResponse, setSelectedLeadResponse] = useState(null);
  const currentUserId = useSelector(selectCurrentUser)?._id;
  const [onlineMap, setOnlineMap] = useState({});
  const [tabValue, setTabValue] = useState('find-lawyers');
  const [isMobile, setIsMobile] = useState(false);
  const [lawyers, setLawyers] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [totalLawyersCount, setTotalLawyersCount] = useState(0);
  const [lawyerOnlineStatus, setLawyerOnlineStatus] = useState({});

  const LIMIT = '10';

  const params = useParams();
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

  const mapUrl = getStaticMapUrl(singleLead?.data?.userProfileId?.address);

  const urgentOption = singleLead?.data?.leadAnswers
    .flatMap((answer) => answer.options || [])
    .find((option) => option.option === 'Urgent');

  const { data: leadWiseResponses, isLoading: isSingleLeadResponseLoading } =
    useGetAllLeadWiseResponsesQuery(id);

  useEffect(() => {
    if (leadWiseResponses?.data?.length > 0) {
      setTabValue('responded-lawyers');
    }
  }, [leadWiseResponses?.data?.length]);

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
    { page, LIMIT, serviceId, leadId },
    {
      skip: !serviceId || !leadId,
    }
  );

  useEffect(() => {
    if (lawyersData && lawyersData?.data?.length > 0) {
      setLawyers((prev) => {
        if (page === 1) {
          // first page → replace
          return lawyersData.data;
        } else {
          // next pages → append
          return [...prev, ...lawyersData.data];
        }
      });
      setTotalPages(lawyersData?.pagination?.totalPage);
      setTotalLawyersCount(lawyersData?.pagination?.total);
    }
  }, [lawyersData, page]);

  const lawyerIds = lawyersData?.data?.map((lawyer) => lawyer?._id) || [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, lawyerIds, (userId, isOnline) => {
    setLawyerOnlineStatus((prev) => ({ ...prev, [userId]: isOnline }));
  });

  //infinite scrolling

  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // only trigger when visible AND not already fetching
        if (entry.isIntersecting && !isFetching) {
          if (totalPages && page < totalPages) {
            // use functional update to avoid stale closure
            // setPage((prevPage) => {
            //   if (prevPage < totalPages) {
            //     return prevPage + 1;
            //   }
            //   return prevPage;
            // });
            setPage((prevPage) => prevPage + 1);
          }
        }
      },
      {
        root: null, // viewport (body scroll)
        threshold: 1, // trigger only when fully visible
        rootMargin: '0px 0px -50px 0px', // margin around viewport
      }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isFetching, totalPages]); // 👈 notice: no `page` dep here

  console.log({ page, isFetching, totalPages });

  const handleShowLeadResponseDetails = (response) => {
    setSelectedLeadResponse(response);
    setShowLeadResponseDetails(true);
  };

  useEffect(() => {
    setIsMobile(window.innerWidth <= 1280);
  }, []);

  if (isSingleLeadLoading) {
    return <ResponseSkeleton />;
  }

  return (
    <div className="lead-board-wraps">
      <div className="lead-board-containers">
        <div className={`w-full`}>
          <div className="rounded-lg p-5 sticky top-[100px]">
            <div className="max-w-full">
              <div className="flex items-center justify-between">
                <Link
                  className="flex py-2 items-center gap-2"
                  href="/client/dashboard/my-cases?redirect=false"
                >
                  {' '}
                  <MoveLeft /> <span>Back to my cases</span>
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
          <div className="px-4 max-w-[1000px] mx-auto">
            <div className="flex w-full flex-col gap-6">
              <Tabs defaultValue="matched-lawyers">
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
                    <div className="flex justify-between mb-5 gap-4 border-b border-gray-400 pt-2 pb-5">
                      <div className="flex gap-2 items-center">
                        <Select>
                          <SelectTrigger className="w-[200px] bg-white">
                            <SelectValue placeholder="All Ratings" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>All Ratings</SelectLabel>
                              <SelectItem value="5">5 stars</SelectItem>
                              <SelectItem value="4">4 stars</SelectItem>
                              <SelectItem value="3">3 stars</SelectItem>
                              <SelectItem value="2">2 stars</SelectItem>
                              <SelectItem value="1">1 star</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger className="w-[200px] bg-white">
                            <SelectValue placeholder="All Response Times" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>All Ratings</SelectLabel>
                              <SelectItem value="5">5 stars</SelectItem>
                              <SelectItem value="4">4 stars</SelectItem>
                              <SelectItem value="3">3 stars</SelectItem>
                              <SelectItem value="2">2 stars</SelectItem>
                              <SelectItem value="1">1 star</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <h4 className="font-medium heading-md text-center">
                          Total {totalLawyersCount}{' '}
                          {totalLawyersCount === 1 ? 'match' : 'matches'}
                        </h4>
                      </div>
                      <Select>
                        <SelectTrigger className="w-[200px] bg-white">
                          <SelectValue placeholder="Sort By: Best Match" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="best-match">
                              Sort By: Best Match
                            </SelectItem>
                            <SelectItem value="popularity">
                              Sort By: popularity
                            </SelectItem>
                            <SelectItem value="order">
                              Sort By: order
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
                          />
                        ))}

                        {/* Only show loader when fetching AND there are already some lawyers */}
                        <div
                          ref={loader}
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
