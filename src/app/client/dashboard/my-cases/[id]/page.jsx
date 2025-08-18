'use client';
import LawyerCard from '@/app/client/_components/LawyerCard';
import LeadResponseCard from '@/app/client/_components/LeadResponseCard';
import LeadResponseDetails from '@/app/client/_components/LeadResponseDetails';
import LeadsHead from '@/app/lawyer/dashboard/_component/LeadsHead';
import LeadsRight from '@/app/lawyer/dashboard/_component/LeadsRight';
import ResponseSkeleton from '@/app/lawyer/dashboard/my-responses/_components/ResponseSkeleton';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
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
    refetch
  } = useGetAllServiceWiseLawyersSuggestionsQuery(
    { page, LIMIT, serviceId, leadId },
    {
      skip: !serviceId || !leadId,
    }
  );

  useEffect(() => {
    if (lawyersData && lawyersData?.data?.length > 0) {
      setLawyers(lawyersData?.data);
      setTotalPages(lawyersData?.pagination?.totalPage);
      setTotalLawyersCount(lawyersData?.pagination?.total);
    }
  }, [lawyersData, lawyersData?.data]);

  const lawyerIds = lawyersData?.data?.map((lawyer) => lawyer?._id) || [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, lawyerIds, (userId, isOnline) => {
    setLawyerOnlineStatus((prev) => ({ ...prev, [userId]: isOnline }));
  });

  // Infinite scroll intersection observer
  const loader = useRef(null);
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
  }, [page, isFetching, totalPages]);

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
    <div className="lead-board-wrap">
      <div className="lead-board-container">
        <div className={`${isMobile ? 'column-6' : 'left-column-7'}`}>
          <div className="column-wrap-left bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
            <div className="max-w-[600px]">
              <div className="flex items-center justify-between">
                <Link
                  className="flex py-2 items-center gap-2"
                  href="/client/dashboard/my-cases?redirect=false"
                >
                  {' '}
                  <MoveLeft /> <span>Back to my cases</span>
                </Link>
              </div>
              <div className="mt-3">
                <div className="flex flex-col items-start gap-4 ">
                  <figure className="w-20 h-20 overflow-hidden rounded-full border border-[#DCE2EA]">
                    <Image
                      src={
                        singleLead?.data?.userProfileId?.profilePicture ??
                        userDummyImage
                      }
                      alt={singleLead?.data?.userProfileId?.name ?? ''}
                      width={80}
                      height={80}
                      priority
                      className="w-full h-full rounded-full object-cover"
                    />
                  </figure>
                  <div>
                    <h2 className="font-medium heading-lg">
                      {singleLead?.data?.userProfileId?.name ?? ''}
                    </h2>
                    <p className="text-gray-500 mt-2">
                      {singleLead?.data?.userProfileId?.address ?? ''}
                    </p>
                  </div>
                </div>
                <hr className="my-5 w-full" />
                <div className="mb-4">
                  <div className="flex items-center gap-2 admin-text font-medium">
                    <PhoneOutgoing className="w-4 h-4" />{' '}
                    <span>
                      Phone: {''}
                      {singleLead?.data?.userProfileId?.phone || ''}
                    </span>{' '}
                  </div>
                  <div className=" flex items-center gap-2 mt-2 admin-text font-medium">
                    <AtSign className="w-4 h-4" />{' '}
                    <span>
                      Email:{' '}
                      {singleLead?.data?.userProfileId?.user?.email || ''}
                    </span>{' '}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex flex-wrap gap-2">
                    {urgentOption?.option && (
                      <TagButton
                        text={urgentOption?.option}
                        bgColor="#FF86021A"
                        icon={<Zap className="text-[#FF8602] w-4 h-4" />}
                      />
                    )}
                    {singleLead?.data?.additionalDetails &&
                      singleLead?.data?.additionalDetails !== '' && (
                        <TagButton
                          text="Additional Details"
                          bgColor="#004DA61A"
                          icon={
                            <BadgeCheck className="text-[#00C3C0] w-4 h-4" />
                          }
                        />
                      )}

                    {singleLead?.data?.userProfileId?.user?.isPhoneVerified ===
                      true && (
                      <TagButton
                        text="Verified Phone"
                        bgColor="#00C3C01A"
                        icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
                      />
                    )}
                  </div>
                </div>
                <hr className="w-full mt-5" />
                <div className="mt-5">
                  <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
                    <h5 className="font-medium mb-2 heading-base">
                      {singleLead?.data?.serviceId?.name ?? ''}
                    </h5>
                    <div className="admin-text text-[#34495E] ">
                      {displayText}
                      {shouldTruncate && (
                        <button
                          onClick={toggleReadMore}
                          className="text-[var(--color-black)] font-semibold hover:underline focus:outline-none ml-2"
                        >
                          {isExpanded ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className=" my-3 ">
                    <h4 className="font-medium heading-lg my-2 heading-md">
                      Location
                    </h4>
                    <div className="mt-5">
                      <img src={mapUrl} className="rounded-lg" alt="map" />
                    </div>
                  </div>
                </div>
                <hr className="w-full mt-5" />
                {singleLead?.data?.leadAnswers?.length > 0 && (
                  <div className="mt-5 space-y-3">
                    <h4 className="font-medium heading-lg mb-5">
                      Answered some of selected questions
                    </h4>
                    <div className="flex flex-col gap-5">
                      {singleLead?.data?.leadAnswers?.map((leadAnswer, i) => (
                        <div key={i}>
                          <p className="text-[var(--color-special)] font-medium">
                            {leadAnswer?.question}
                          </p>
                          <div className="text-[#34495E] mt-2">
                            {leadAnswer?.options &&
                              leadAnswer?.options
                                .map(
                                  (option) =>
                                    option?.option
                                      ?.replace(/_/g, ' ') // replace underscores with spaces
                                      ?.replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                      ) // capitalize each word
                                )
                                .join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`${isMobile ? 'column-6' : 'right-column-5'}`}>
          <div className="column-wrap-right px-4" id="scroll-target-for-data">
            <div className="flex w-full flex-col gap-6">
              <Tabs value={tabValue} onValueChange={setTabValue}>
                <TabsList className="w-full justify-start gap-2 pb-4 border-b border-gray-200">
                  <TabsTrigger
                    value="responded-lawyers"
                    className="border border-gray-300 shadow-none"
                  >
                    Lawyers who responded
                  </TabsTrigger>
                  <TabsTrigger
                    value="find-lawyers"
                    className="border border-gray-200"
                  >
                    Find Lawyers
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
                <TabsContent value="find-lawyers">
                  <div className="my-3">
                    <h4 className="font-medium heading-lg mb-5 text-center">
                      Total matched {totalLawyersCount}{' '}
                      {totalLawyersCount === 1 ? 'lawyer' : 'lawyers'}
                    </h4>
                    <div className="flex flex-col gap-5">
                      {lawyers?.map((lawyer, i) => (
                        <LawyerCard
                          key={i}
                          lawyer={lawyer}
                          id={id}
                          lawyerOnlineStatus={lawyerOnlineStatus}
                          refetch={refetch}
                        />
                      ))}
                      <div ref={loader}>
                        {isFetching && (
                          <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                        )}
                      </div>
                    </div>
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
