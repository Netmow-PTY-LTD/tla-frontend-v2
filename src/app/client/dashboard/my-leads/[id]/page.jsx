'use client';
import LeadResponseCard from '@/app/client/_components/LeadResponseCard';
import LeadResponseDetails from '@/app/client/_components/LeadResponseDetails';
import LeadsHead from '@/app/lawyer/dashboard/_component/LeadsHead';
import LeadsRight from '@/app/lawyer/dashboard/_component/LeadsRight';
import ResponseSkeleton from '@/app/lawyer/dashboard/my-responses/_components/ResponseSkeleton';
import LeadCard from '@/components/dashboard/lawyer/components/LeadCard';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { data } from '@/data/data';
import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
import { useGetAllLeadWiseResponsesQuery } from '@/store/features/client/LeadsApiService';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
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
import { useEffect, useState } from 'react';

export default function LeadDetailsPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLeadResponseDetails, setShowLeadResponseDetails] = useState(true);
  const [selectedLeadResponse, setSelectedLeadResponse] = useState(null);
  const params = useParams();
  const id = params.id;

  const { data: singleLead, isLoading: isSingleLeadLoading } =
    useGetSingleLeadQuery(id, {
      skip: !id,
    });

  // console.log('singleLead', singleLead);

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

  console.log('leadWiseResponses', leadWiseResponses);

  const handleShowLeadResponseDetails = (response) => {
    setSelectedLeadResponse(response);
    setShowLeadResponseDetails(true);
  };

  if (isSingleLeadLoading) {
    return <ResponseSkeleton />;
  }

  return (
    <div className="lead-board-wrap">
      <div className="lead-board-container">
        <div className="left-column-7">
          <div className="column-wrap-left bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
            <div className="max-w-[600px]">
              <div className="flex items-center justify-between">
                <Link
                  className="flex py-2 items-center gap-2"
                  href="/client/dashboard/my-leads"
                >
                  {' '}
                  <MoveLeft /> <span>Back to leads</span>
                </Link>
              </div>
              <div className="mt-3">
                <div className="flex flex-col items-start gap-4 ">
                  <figure className="w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={`${
                        singleLead?.data?.userProfileId?.profilePicture ??
                        '/assets/img/auth-step1.png'
                      }`}
                      alt={singleLead?.data?.userProfileId?.name ?? 'John Doe'}
                      width={80}
                      height={80}
                      priority
                      className="rounded-full object-cover"
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
                <hr className="border-[#F3F3F3] my-5  " />
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

                    {singleLead?.data?.userProfileId?.phone && (
                      <TagButton
                        text="Verified Phone"
                        bgColor="#00C3C01A"
                        icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
                      />
                    )}
                  </div>
                </div>
                <hr className="border-[#F3F3F3] h-1 w-full mt-5" />
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
                <hr className="border-[#F3F3F3] h-1 w-full mt-5" />
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
                                ?.map((option) => option?.option)
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
        <div className="right-column-5">
          <div className="column-wrap-right px-4">
            {isSingleLeadResponseLoading ? (
              <ResponseSkeleton />
            ) : (
              <>
                <div className="leads-top-row">
                  <h2
                    className={`font-bold heading-base text-[#0B1C2D] text-left`}
                  >
                    Lawyers who responded
                  </h2>
                </div>
                <hr className="bg-[#F3F3F3] h-1 w-full my-2" />
                {showLeadResponseDetails && selectedLeadResponse ? (
                  <LeadResponseDetails
                    onBack={() => setShowLeadResponseDetails(false)}
                    response={selectedLeadResponse}
                  />
                ) : (
                  <div className="leads-bottom-row">
                    <div className={`grid grid-cols-1 gap-y-4`}>
                      {leadWiseResponses?.data?.map((response, i) => (
                        <LeadResponseCard
                          key={i}
                          response={response}
                          isExpanded={isExpanded}
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
          </div>
        </div>
      </div>
    </div>
  );
}
