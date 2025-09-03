'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';

import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import {
  AtSign,
  BadgeCent,
  BadgeCheck,
  CircleAlert,
  Inbox,
  List,
  Loader,
  MoveLeft,
  PhoneOutgoing,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LawyerContactButton from './leadBoard/LawyerContactButton';
import ResponseSkeleton from '../my-responses/_components/ResponseSkeleton';
import { formatRelativeTime } from '@/helpers/formatTime';
import { userDummyImage } from '@/data/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRealTimeStatus } from '@/hooks/useSocketListener';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/auth/authSlice';

export default function LeadDetailsPage({
  onBack,
  lead,
  singleLead,
  isSingleLeadLoading,
  data,
}) {
  const fullText =
    singleLead?.additionalDetails === ''
      ? `If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance. If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance.`
      : singleLead?.additionalDetails;

  const getTruncatedText = (text, maxLength) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  //console.log('single lead data ===>', lead);
  const currentUserId = useSelector(selectCurrentUser)?._id;
  const [onlineMap, setOnlineMap] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const maxLength = 300;

  const shouldTruncate = fullText?.length > maxLength;
  const displayText =
    isExpanded || !shouldTruncate
      ? fullText
      : getTruncatedText(fullText, maxLength);

  useEffect(() => {
    // Scroll to top of the window when this component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const mapUrl = getStaticMapUrl(lead?.userProfileId?.address);

  const userIds = data?.map((lead) => lead?.userProfileId?.user?._id) || [];

  // ✅ Use hook directly (at top level of component)
  useRealTimeStatus(currentUserId, userIds, (userId, isOnline) => {
    setOnlineMap((prev) => ({ ...prev, [userId]: isOnline }));
  });

  const profileType = singleLead?.userProfileId?.profileType;
  const badge = profileType
    ?.replace(/[^a-zA-Z0-9]+/g, ' ')
    ?.split(' ')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join('');

  const ResponseProgressBar = ({ responded = 0, total = 5 }) => {
    const bars = Array.from({ length: total }, (_, index) => (
      <div
        key={index}
        className={`w-[10px] h-[20px] ${index < responded ? 'bg-green-400' : 'bg-gray-300'
          }`}
      ></div>
    ));

    return (
      <div className="border border-gray-300 rounded-lg p-4 inline-flex gap-2 mt-2 mb-5">
        <div className="flex gap-1">{bars}</div>
        <div className="text-black text-[14px] font-semibold">
          {responded > total
            ? `${total}+ professionals have responded.`
            : `${responded}/${total} professionals have responded.`}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {isSingleLeadLoading ? (
        <ResponseSkeleton />
      ) : lead ? (
        <div className="max-w-[900px]">
          <div className="flex items-center justify-between">
            <button className="flex py-2 items-center gap-2" onClick={onBack}>
              {' '}
              <MoveLeft /> <span>Back to cases</span>
            </button>
          </div>
          <div className="mt-3 max-w-4xl">
            <div className="flex justify-between">
              <div className="flex flex-col items-start gap-4 z-0 ">
                <Avatar className="w-20 h-20 z-10">
                  <AvatarImage
                    src={`${lead?.userProfileId?.profilePicture ?? userDummyImage
                      }`}
                    alt={lead?.userProfileId?.name ?? 'John Doe'}
                  />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-medium heading-lg">
                      {lead?.userProfileId?.name ?? ''}
                    </h2>
                    <span className="text-xs">
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`ml-2 w-2 h-2 rounded-full ${onlineMap[lead?.userProfileId?.user?._id]
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                            }`}
                        ></span>
                        <span className="text-gray-700">
                          {onlineMap[lead?.userProfileId?.user?._id]
                            ? 'Online'
                            : 'Offline'}
                        </span>
                      </div>
                    </span>
                  </div>
                  <p className="text-gray-500 mt-2">
                    {lead?.userProfileId?.address ?? ''}
                  </p>
                </div>
              </div>
              <p className="font-medium text-[12px] text-gray-600 sm:ml-4 mt-2 sm:mt-0">
                {lead?.createdAt && formatRelativeTime(lead?.createdAt)}
              </p>
            </div>
            <hr className="border-[#F3F3F3] my-5" />
            <div className="mb-4">
              <div className="flex items-center gap-2 admin-text font-medium">
                <PhoneOutgoing className="w-4 h-4" />{' '}
                <span>
                  Phone: {''}
                  {(() => {
                    const phone = lead?.userProfileId?.phone;
                    return phone
                      ? `${phone.slice(0, 3)}${'*'.repeat(
                        Math.max(0, phone.length - 3)
                      )}`
                      : '480*******';
                  })()}
                </span>{' '}
              </div>
              <div className=" flex items-center gap-2 mt-2 admin-text font-medium">
                <AtSign className="w-4 h-4" />{' '}
                <span>
                  Email:{' '}
                  {(() => {
                    const email = singleLead?.userProfileId?.user?.email;
                    if (!email) return 't*******@e********.com';

                    const [user, domain] = email.split('@');
                    const maskedUser =
                      user[0] + '*'.repeat(Math.max(user.length - 1, 0));
                    const maskedDomain =
                      domain[0] +
                      '*'.repeat(Math.max(domain.indexOf('.'), 0)) +
                      domain.slice(domain.indexOf('.'));

                    return `${maskedUser}@${maskedDomain}`;
                  })()}
                </span>{' '}
              </div>
            </div>
            <ResponseProgressBar
              responded={singleLead?.responders?.length || 0}
            />
            {singleLead?.credit != null && singleLead?.credit > 0 && (
              <div className="flex flex-wrap items-center gap-4 bg-[#ff86021A] px-4 py-3 mt-4 mb-8 rounded-md w-max">
                <div className="flex items-center gap-2 pr-5 border-r border-yellow-300">
                  <BadgeCent className="w-5 h-5" />
                  <span className="font-semibold">
                    {' '}
                    {singleLead?.credit}{' '}
                    {singleLead?.credit > 1 ? 'credits' : 'credit'}
                  </span>
                </div>
                <div className="flex items-center gap-10">
                  <p className="text-[14px] font-medium text-gray-600">
                    Covered by our hiring policy
                  </p>
                  <Image
                    src="/assets/img/tlabadge.svg"
                    width={44}
                    height={44}
                    alt="tlabadge"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {/*  need to credit purchase modal */}
              {!lead?.isContact || !singleLead?.isHired ? (
                <>
                  <LawyerContactButton leadDetail={singleLead} />
                </>
              ) : (
                <>
                  <p className="text-[14px] font-medium bg-[#FF8602] py-1 px-2 rounded text-white">
                    In Response
                  </p>
                </>
              )}
            </div>
            {(singleLead?.additionalDetails &&
              singleLead.additionalDetails !== '') ||
              singleLead?.leadPriority?.toLowerCase() === 'urgent' ||
              singleLead?.userProfileId?.phone ? (
              <div className="mt-5">
                <div className="flex flex-wrap gap-2">
                  {singleLead?.additionalDetails &&
                    singleLead.additionalDetails !== '' && (
                      <TagButton
                        text="Additional Details"
                        bgColor="#004DA61A"
                        icon={<List className="text-[#000] w-4 h-4" />}
                      />
                    )}

                  {singleLead?.userProfileId?.user?.isPhoneVerified ===
                    true && (
                      <TagButton
                        text="Verified Phone"
                        bgColor="#00C3C01A"
                        icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
                      />
                    )}

                  {singleLead?.leadPriority?.toLowerCase() === 'urgent' && (
                    <TagButton
                      text={singleLead?.leadPriority}
                      bgColor="#FF86021A"
                      textColor="text-[#FF8602]"
                      icon={<Zap className="text-[#FF8602] w-4 h-4" />}
                    />
                  )}
                </div>
              </div>
            ) : null}

            <hr className="w-full mt-5" />
            <div className="mt-5">
              <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
                <h5 className="font-medium mb-2 heading-base">
                  {singleLead?.serviceId?.name ?? ''}
                </h5>
                <div className="text-sm text-[#34495E] ">
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
            {singleLead?.leadAnswers?.length > 0 && (
              <div className="mt-5 space-y-3">
                <h4 className="font-medium heading-lg mb-5">
                  Answered some of selected questions
                </h4>
                <div className="flex flex-col gap-5">
                  {singleLead?.leadAnswers?.map((leadAnswer, i) => (
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
      ) : (
        <>
          <div className="flex flex-col justify-center items-center h-full">
            <Inbox className="w-12 h-12 mb-4 text-gray-400" />
            <h4 className="italic text-[18px] text-gray-500">
              Currently there are no cases.
            </h4>
          </div>
        </>
      )}
    </div>
  );
}
