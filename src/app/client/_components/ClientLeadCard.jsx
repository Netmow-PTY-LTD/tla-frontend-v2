import { Card } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import { BadgeCheck, CircleAlert, Zap } from 'lucide-react';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import Link from 'next/link';

const ClientLeadCard = ({ user, isExpanded }) => {
  const { data: singleLead, isLoading } = useGetSingleLeadQuery(user?._id);

  //console.log('Single Lead Data:', user);

  const urgentOption = singleLead?.data?.leadAnswers
    .flatMap((answer) => answer.options || [])
    .find((option) => option.option === 'Urgent');

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 5) return 'Just now';

    const units = [
      { max: 60, value: 1, name: 's' }, // seconds
      { max: 3600, value: 60, name: 'm' }, // minutes
      { max: 86400, value: 3600, name: 'h' }, // hours
      { max: 2592000, value: 86400, name: 'd' }, // days
      { max: 31536000, value: 2592000, name: 'mo' }, // months
      { max: Infinity, value: 31536000, name: 'y' }, // years
    ];

    for (const unit of units) {
      if (diffInSeconds < unit.max) {
        const value = Math.floor(diffInSeconds / unit.value);
        return `${value}${unit.name} ago`;
      }
    }
  };

  return (
    <Card className="w-full max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap bg-[#004DA61A] sm:flex-nowrap items-center gap-3 p-3 rounded-tl-xl rounded-tr-xl">
        <figure className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={`${
              user?.userProfileId?.profilePicture ??
              '/assets/img/auth-step1.png'
            }`}
            alt={user?.userProfileId?.name ?? 'John Doe'}
            width={40}
            height={40}
            priority
            className="rounded-full object-cover"
          />
        </figure>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
          <div>
            <div
              className={`font-medium mb-1 ${
                isExpanded ? 'heading-md' : 'text-[13px]'
              }`}
            >
              {user?.userProfileId?.name}
            </div>
            <div
              className={`${
                isExpanded ? 'text-[13px]' : 'text-[10px]'
              } text-gray-500`}
            >
              {user?.userProfileId?.address ?? ''}
            </div>
          </div>
          <p className="font-medium text-[11px] text-gray-600 sm:ml-4 mt-2 sm:mt-0">
            {user?.createdAt && formatRelativeTime(user?.createdAt)}
          </p>
        </div>
      </div>

      <hr className="border-[#F3F3F3] border" />

      {/* Matched Criteria */}
      <div className="px-3 pt-3 pb-2">
        {(urgentOption?.option ||
          user?.additionalDetails ||
          user?.userProfileId?.phone) && (
          <h4
            className={`font-medium mb-2 ${
              isExpanded ? 'heading-md' : 'text-[13px]'
            }`}
          >
            Matched criteria
          </h4>
        )}

        <div className="flex flex-wrap gap-2">
          {urgentOption?.option && (
            <TagButton
              text={urgentOption?.option}
              bgColor="#FF86021A"
              icon={<Zap className="text-[#FF8602] w-4 h-4" />}
            />
          )}
          {user?.additionalDetails && user?.additionalDetails !== '' && (
            <TagButton
              text="Additional Details"
              bgColor="#004DA61A"
              icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
            />
          )}

          {user?.userProfileId?.phone && (
            <TagButton
              text="Verified Phone"
              bgColor="#00C3C01A"
              icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
            />
          )}
        </div>
      </div>

      {/* Job Description */}
      <div className="p-3">
        {user?.serviceId?.name && (
          <h3
            className={`font-medium mb-2 ${
              isExpanded ? 'heading-md' : 'text-[13px]'
            }`}
          >
            Looking for a {user?.serviceId?.name} consultation
          </h3>
        )}

        <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
          <h4
            className={`font-medium mb-2 ${
              isExpanded ? 'heading-base' : 'text-[14px]'
            }`}
          >
            {user?.serviceId?.name}
          </h4>
          <p className="text-sm text-gray-500 mb-2">
            {user?.createdAt &&
              (() => {
                const date = new Date(user?.createdAt);
                const weekday = date.toLocaleDateString('en-GB', {
                  weekday: 'long',
                });
                const day = date.getDate().toString().padStart(2, '0');
                const month = date.toLocaleDateString('en-GB', {
                  month: 'long',
                });
                return `${weekday}, ${day} ${month}`;
              })()}
          </p>
          <div
            className={`text-[#34495E] ${
              isExpanded ? 'text-[13px]' : 'text-[12px]'
            }`}
          >
            {user?.additionalDetails === ''
              ? `If you're facing a divorce, it's crucial to seek professional legal
            advice. Our consultations cover everything from asset division to
            child custody arrangements, ensuring you understand your rights and
            options. Let us help you navigate this challenging time with expert
            guidance.`
              : user?.additionalDetails}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-3 gap-3 sm:gap-0">
        <Link
          className={`px-4 py-2.5 w-full sm:w-auto rounded-lg ${
            isExpanded ? 'heading-base' : 'text-[12px] '
          } font-medium bg-[var(--color-special)] text-white hover:bg-gray-950 transition`}
          href={`/client/dashboard/my-leads/${user?._id}`}
        >
          View Lead Details
        </Link>
        {user?.credit && (
          <p
            className={`text-[#34495E] ${
              isExpanded ? 'heading-base' : 'text-[12px]'
            } flex items-center gap-2`}
          >
            <span>{user?.credit} Credits required</span>
            <CircleAlert className="w-4 h-4" />
          </p>
        )}
      </div>
    </Card>
  );
};

export default ClientLeadCard;
