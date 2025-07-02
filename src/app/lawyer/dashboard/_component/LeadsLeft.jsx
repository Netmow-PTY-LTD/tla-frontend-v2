'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';

import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
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
import { useEffect, useState } from 'react';
import LawyerContactButton from './leadBoard/LawyerContactButton';

export default function LeadDetailsPage({ onBack, lead }) {
  const { data: singleLead, isLoading: isSingleLeadLoading } =
    useGetSingleLeadQuery(lead?._id);

  const fullText =
    singleLead?.data?.additionalDetails === ''
      ? `If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance. If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance.`
      : singleLead?.data?.additionalDetails;

  const getTruncatedText = (text, maxLength) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

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

  const urgentOption = singleLead?.data?.leadAnswers
    .flatMap((answer) => answer.options || [])
    .find((option) => option.option === 'Urgent');

  return (
    <div className="">
      <div className="bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
        <div className="flex items-center justify-between">
          <button className="flex py-2 items-center gap-2" onClick={onBack}>
            {' '}
            <MoveLeft /> <span>Back to leads</span>
          </button>
        </div>
        <div className="mt-3 max-w-4xl">
          <div className="flex flex-col items-start gap-4 ">
            <figure className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={`${
                  lead?.userProfileId?.profilePicture ??
                  '/assets/img/auth-step1.png'
                }`}
                alt={lead?.userProfileId?.name ?? 'John Doe'}
                width={80}
                height={80}
                priority
                className="rounded-full object-cover"
              />
            </figure>
            <div>
              <h2 className="font-medium heading-lg">
                {lead?.userProfileId?.name ?? ''}
              </h2>
              <p className="text-gray-500 mt-2">
                {lead?.userProfileId?.address ?? ''}
              </p>
            </div>
          </div>
          <hr className="border-[#F3F3F3] my-5  " />
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
                  const email = singleLead?.data?.userProfileId?.user?.email;
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
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/*  need to credit purchase modal */}
            <LawyerContactButton leadDetail={singleLead?.data} />
            {singleLead?.data?.credit && (
              <div className="text-[#34495E] ml-2 flex items-center gap-2">
                <span>
                  {singleLead?.data?.credit}{' '}
                  {singleLead?.data?.credit > 1 ? 'credits' : 'credit'} required
                </span>
                <CircleAlert />
              </div>
            )}
          </div>
          <div className="mt-5">
            <h4 className="font-medium mb-1 heading-base">Matched criteria</h4>
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
                    icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
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
  );
}
