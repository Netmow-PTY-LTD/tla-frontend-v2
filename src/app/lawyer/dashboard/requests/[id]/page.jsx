'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { useGetRequestFromClientByIdQuery } from '@/store/features/public/publicApiService';
import Link from 'next/link';
import {
  AtSign,
  BadgeCent,
  BadgeCheck,
  List,
  MoveLeft,
  PhoneOutgoing,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userDummyImage } from '@/data/data';
import { formatRelativeTime } from '@/helpers/formatTime';
import LawyerContactButton from '../../_component/leadBoard/LawyerContactButton';
import Image from 'next/image';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';

export default function RequestDetails() {
  const [isExpanded, setIsExpanded] = useState(false);

  const params = useParams();
  const { id } = params;

  const { data: singleRequest, isLoading: isSingleRequestLoading } =
    useGetSingleLeadQuery(id, { skip: !id });

  console.log('singleRequest', singleRequest);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const fullText =
    singleRequest?.data?.additionalDetails === ''
      ? `If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance. If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance.`
      : singleRequest?.data?.additionalDetails;

  const getTruncatedText = (text, maxLength) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };
  const maxLength = 300;

  const shouldTruncate = fullText?.length > maxLength;
  const displayText =
    isExpanded || !shouldTruncate
      ? fullText
      : getTruncatedText(fullText, maxLength);

  const mapUrl = getStaticMapUrl(singleRequest?.data?.userProfileId?.address);

  const ResponseProgressBar = ({ responded = 0, total = 5 }) => {
    const bars = Array.from({ length: total }, (_, index) => (
      <div
        key={index}
        className={`w-[10px] h-[20px] ${
          index < responded ? 'bg-green-400' : 'bg-gray-300'
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

  if (isSingleRequestLoading) {
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
    <>
      <div className="lead-board-wrap">
        <div className="lead-board-container">
          <div className="w-full">
            <div className="column-wrap-left bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
              <div className="bg-white">
                <div className="max-w-[900px]">
                  <div className="flex items-center justify-between">
                    <Link
                      className="flex py-2 items-center gap-2"
                      href="/lawyer/dashboard/requests"
                    >
                      {' '}
                      <MoveLeft /> <span>Back to requests</span>
                    </Link>
                  </div>
                  <div className="mt-3 max-w-4xl">
                    <div className="flex justify-between">
                      <div className="flex flex-col items-start gap-4 z-0 ">
                        <Avatar className="w-20 h-20 z-10">
                          <AvatarImage
                            src={`${
                              singleRequest?.data?.userProfileId
                                ?.profilePicture ?? userDummyImage
                            }`}
                            alt={
                              singleRequest?.data?.userProfileId?.name ??
                              'John Doe'
                            }
                          />
                          <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="font-medium heading-lg">
                              {singleRequest?.data?.userProfileId?.name ?? ''}
                            </h2>
                            {/* <span className="text-xs">
                              <div className="flex items-center gap-2 text-sm">
                                <span
                                  className={`ml-2 w-2 h-2 rounded-full ${
                                    onlineMap[lead?.userProfileId?.user]
                                      ? 'bg-green-500'
                                      : 'bg-gray-400'
                                  }`}
                                ></span>
                                <span className="text-gray-700">
                                  {onlineMap[lead?.userProfileId?.user]
                                    ? 'Online'
                                    : 'Offline'}
                                </span>
                              </div>
                            </span> */}
                          </div>
                          <p className="text-gray-500 mt-2">
                            {singleRequest?.data?.userProfileId?.address ?? ''}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-[12px] text-gray-600 sm:ml-4 mt-2 sm:mt-0">
                        {singleRequest?.data?.createdAt &&
                          formatRelativeTime(singleRequest?.data?.createdAt)}
                      </p>
                    </div>
                    <hr className="border-[#F3F3F3] my-5" />
                    <div className="mb-4">
                      <div className="flex items-center gap-2 admin-text font-medium">
                        <PhoneOutgoing className="w-4 h-4" />{' '}
                        <span>
                          Phone: {''}
                          {(() => {
                            const phone =
                              singleRequest?.data?.userProfileId?.phone;
                            if (!phone) return;
                            return `${phone.slice(0, 3)}${'*'.repeat(
                              Math.max(0, phone.length - 3)
                            )}`;
                          })()}
                        </span>{' '}
                      </div>
                      <div className=" flex items-center gap-2 mt-2 admin-text font-medium">
                        <AtSign className="w-4 h-4" />{' '}
                        <span>
                          Email:{' '}
                          {(() => {
                            const email =
                              singleRequest?.data?.userProfileId?.user?.email;
                            if (!email) return;

                            const [user, domain] = email.split('@');
                            const maskedUser =
                              user[0] +
                              '*'.repeat(Math.max(user.length - 1, 0));
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
                      responded={singleRequest?.data?.responders?.length || 0}
                    />
                    {singleRequest?.data?.userProfileId?.credits != null &&
                      singleRequest?.data?.userProfileId?.credits > 0 && (
                        <div className="flex flex-wrap items-center gap-4 bg-[#ff86021A] px-4 py-3 mt-4 mb-8 rounded-md w-max">
                          <div className="flex items-center gap-2 pr-5 border-r border-yellow-300">
                            <BadgeCent className="w-5 h-5" />
                            <span className="font-semibold">
                              {' '}
                              {singleRequest?.data?.userProfileId?.credits}{' '}
                              {singleRequest?.data?.userProfileId?.credits > 1
                                ? 'credits'
                                : 'credit'}
                            </span>
                          </div>
                          <div className="flex items-center gap-10">
                            <p className="text-[14px] font-medium text-gray-600">
                              Covered by our Get Hired Guarantee
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

                    {!singleRequest?.data?.isContact && (
                      <div className="flex flex-wrap items-center gap-4">
                        <>
                          <LawyerContactButton
                            leadDetail={singleRequest?.data}
                          />
                        </>
                      </div>
                    )}
                    {(singleRequest?.data?.additionalDetails &&
                      singleRequest?.data?.additionalDetails !== '') ||
                    singleRequest?.data?.leadPriority?.toLowerCase() ===
                      'urgent' ||
                    singleRequest?.data?.userProfileId?.phone ? (
                      <div className="mt-5">
                        <div className="flex flex-wrap gap-2">
                          {singleRequest?.data?.additionalDetails &&
                            singleRequest?.data?.additionalDetails !== '' && (
                              <TagButton
                                text="Additional Details"
                                bgColor="#004DA61A"
                                icon={<List className="text-[#000] w-4 h-4" />}
                              />
                            )}

                          {/* {singleRequest?.data?.userProfileId?.phone && (
                            <TagButton
                              text="Verified Phone"
                              bgColor="#00C3C01A"
                              icon={
                                <BadgeCheck className="text-[#00C3C0] w-4 h-4" />
                              }
                            />
                          )} */}

                          {singleRequest?.data?.leadPriority?.toLowerCase() ===
                            'urgent' && (
                            <TagButton
                              text={singleRequest?.data?.leadPriority}
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
                          {singleRequest?.data?.serviceId?.name ?? ''}
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
                    {singleRequest?.data?.leadAnswers?.length > 0 && (
                      <div className="mt-5 space-y-3">
                        <h4 className="font-medium heading-lg mb-5">
                          Answered some of selected questions
                        </h4>
                        <div className="flex flex-col gap-5">
                          {singleRequest?.data?.leadAnswers?.map(
                            (leadAnswer, i) => (
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
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
