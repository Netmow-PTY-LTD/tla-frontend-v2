import { Card } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import TagButton from './TagButton';
import { BadgeCheck, CircleAlert, Zap } from 'lucide-react';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/helpers/formatTime';
import { userDummyImage } from '@/data/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const LeadCard = ({ onViewDetails, user, isExpanded }) => {
  const { data: singleLead, isLoading } = useGetSingleLeadQuery(user?._id);

  const urgentOption = singleLead?.data?.leadAnswers
    .flatMap((answer) => answer.options || [])
    .find((option) => option.option === 'Urgent');

  // const badge = singleLead?.data?.badge;
  const profileType = singleLead?.data?.userProfileId?.profileType;
  const badge = profileType
    ?.replace(/[^a-zA-Z0-9]+/g, ' ')
    ?.split(' ')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join('');

  return (
    <Card className="w-full max-w-full mx-auto flex flex-col ">
      {/* Header Section */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 p-3">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 ">
          <figure className="w-10 h-10 overflow-hidden flex-shrink-0 border rounded-full">
            <Image
              src={`${user?.userProfileId?.profilePicture ?? userDummyImage}`}
              alt={user?.userProfileId?.name ?? ''}
              width={40}
              height={40}
              priority
              className="w-full h-full rounded-full object-cover"
            />
          </figure>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <div>
              <div
                className={`font-medium mb-1 ${
                  isExpanded ? 'heading-base' : 'text-[13px]'
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
          </div>
        </div>
        <p className="font-medium text-[11px] text-gray-600 sm:ml-4 mt-2 sm:mt-0">
          {user?.createdAt && formatRelativeTime(user?.createdAt)}
        </p>
      </div>

      <hr className="border-[#F3F3F3] border" />
      {(user?.additionalDetails && user.additionalDetails !== '') ||
      urgentOption?.option ||
      user?.userProfileId?.phone ||
      badge ? (
        <div className="px-3 pt-3 pb-2">
          <div className="flex flex-wrap gap-2">
            {user?.additionalDetails && user.additionalDetails !== '' && (
              <TagButton
                text="Additional Details"
                bgColor="#004DA61A"
                icon={<BadgeCheck className="text-[#000] w-4 h-4" />}
              />
            )}
            {urgentOption?.option && (
              <TagButton
                text={urgentOption.option}
                bgColor="#FF86021A"
                icon={<Zap className="text-[#FF8602] w-4 h-4" />}
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
      ) : null}

      {/* Job Description */}
      <div className="p-3 flex-1">
        {user?.serviceId?.name && (
          <h3
            className={`font-medium mb-2 ${
              isExpanded ? 'heading-base' : 'text-[13px]'
            }`}
          >
            Looking for a {user?.serviceId?.name} consultation
          </h3>
        )}

        {user?.isContact === true ? (
          <div className="py-1">
            <span className="text-[12px] font-medium bg-[#FF8602] py-1 px-2 rounded text-white">
              In Response
            </span>
          </div>
        ) : null}

        <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
          <h4
            className={`font-medium mb-2 ${
              isExpanded ? 'heading-base' : 'text-[14px]'
            }`}
          >
            {user?.serviceId?.name}
          </h4>
          <p
            className={`text-[#878787] ${
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
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-3 gap-3 sm:gap-0">
        <Button
          className={`px-4 py-2 w-full sm:w-auto rounded-lg ${
            isExpanded ? 'text-[14px]' : 'text-[12px] '
          } font-medium bg-[var(--color-special)] text-white`}
          onClick={() => onViewDetails(user)}
        >
          View Details
        </Button>
        {user?.credit != null && (
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

export default LeadCard;
