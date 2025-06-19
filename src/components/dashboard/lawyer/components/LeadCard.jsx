import { Card } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import TagButton from './TagButton';
import { BadgeCheck, CircleAlert, Zap } from 'lucide-react';

const LeadCard = ({ onViewDetails, user, isExpanded }) => {
  return (
    <Card className="w-full max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3">
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
          <p className="font-medium text-[10px] text-gray-600 sm:ml-4 mt-2 sm:mt-0">
            Just now
          </p>
        </div>
      </div>

      <hr className="border-[#F3F3F3] border" />

      {/* Matched Criteria */}
      <div className="px-3 pt-3 pb-2">
        <h4
          className={`font-medium mb-2 ${
            isExpanded ? 'heading-md' : 'text-[13px]'
          }`}
        >
          Matched criteria
        </h4>
        <div className="flex flex-wrap gap-2">
          <TagButton
            text="Urgent"
            bgColor="#FF86021A"
            icon={<Zap className="text-[#FF8602] w-4 h-4" />}
            clas
          />
          <TagButton
            text="Separation Law"
            bgColor="#004DA61A"
            icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
          />
          <TagButton text="Criminal Law" bgColor="#A600161A" />
        </div>
      </div>

      {/* Job Description */}
      <div className="p-3">
        <h3
          className={`font-medium mb-2 ${
            isExpanded ? 'heading-md' : 'text-[13px]'
          }`}
        >
          Looking for a divorce law consultation
        </h3>
        <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
          <h4
            className={`font-medium mb-2 ${
              isExpanded ? 'heading-base' : 'text-[14px]'
            }`}
          >
            Position Overview
          </h4>
          <p
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
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-3 gap-3 sm:gap-0">
        <button
          className={`px-5 py-3 w-full sm:w-auto rounded-lg ${
            isExpanded ? 'heading-base' : 'text-[12px] '
          } font-medium bg-[var(--color-special)] text-[#0B1C2D]`}
          onClick={() => onViewDetails(user)}
        >
          View Job Details
        </button>
        <p
          className={`text-[#34495E] ${
            isExpanded ? 'heading-base' : 'text-[12px]'
          } flex items-center gap-2`}
        >
          <span>49 Credits required</span>
          <CircleAlert className="w-4 h-4" />
        </p>
      </div>
    </Card>
  );
};

export default LeadCard;
