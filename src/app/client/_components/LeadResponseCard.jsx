import { Card } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import { BadgeCheck, CircleAlert, CircleDotDashed, Zap } from 'lucide-react';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/helpers/formatTime';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';

const LeadResponseCard = ({
  handleShowLeadResponseDetails,
  response,
  isExpanded,
}) => {
  console.log('response', response);
  const { data: singleLeadResponse, isLoading } = useGetSingleLeadQuery(
    response?._id
  );
  //console.log('Single Lead Data:', singleLead);

  //   const urgentOption = response?.leadAnswers
  //     .flatMap((answer) => answer.options || [])
  //     .find((option) => option.option === 'Urgent');

  const badge = response?.lawyerBadge;

  return (
    <Card className="w-full max-w-full mx-auto flex flex-col">
      {/* Header Section */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 p-3">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <figure className="w-10 h-10 overflow-hidden flex-shrink-0">
            <Image
              src={`${
                response?.responseBy?.profilePicture ?? '/assets/img/avatar.png'
              }`}
              alt={response?.responseBy?.name ?? ''}
              width={40}
              height={40}
              priority
              className="rounded-full object-cover w-full h-full"
            />
          </figure>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <div>
              <div
                className={`font-medium mb-1 ${
                  isExpanded ? 'heading-base' : 'text-[13px]'
                }`}
              >
                {response?.responseBy?.name}
              </div>
              <div
                className={`${
                  isExpanded ? 'text-[13px]' : 'text-[10px]'
                } text-gray-500`}
              >
                {response?.responseBy?.address ?? ''}
              </div>
            </div>
          </div>
        </div>
        <p className="font-medium text-[11px] text-gray-600 sm:ml-4 mt-2 sm:mt-0">
          {response?.createdAt && formatRelativeTime(response?.createdAt)}
        </p>
      </div>

      <hr className="border-[#F3F3F3] border" />

      {/* Matched Criteria */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex flex-wrap gap-2">
          {badge && (
            <>
              <TagButton
                text={badge}
                bgColor="#00C3C03A"
                icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
              />
            </>
          )}

          {/* {response?.additionalDetails &&
            response?.additionalDetails !== '' && (
              <TagButton
                text="Additional Details"
                bgColor="#004DA61A"
                icon={<BadgeCheck className="text-[#000] w-4 h-4" />}
              />
            )} */}
          {/* {urgentOption?.option && (
            <TagButton
              text={urgentOption?.option}
              bgColor="#FF86021A"
              icon={<Zap className="text-[#FF8602] w-4 h-4" />}
            />
          )} */}

          {response?.userProfileId?.phone && (
            <TagButton
              text="Verified Phone"
              bgColor="#00C3C01A"
              icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
            />
          )}
        </div>
      </div>

      {/* Job Description */}
      {response?.serviceId?.name && (
        <div className="p-3 flex-1">
          <div className="p-3 bg-[#F3F3F3] rounded-lg">
            <h4
              className={`font-medium mb-2 ${
                isExpanded ? 'heading-base' : 'text-[14px]'
              }`}
            >
              {response?.serviceId?.name}
            </h4>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row items-center p-3 gap-4">
        <Button
          className={`px-4 py-2 w-full sm:w-auto rounded-lg ${
            isExpanded ? 'text-[14px]' : 'text-[12px] '
          } font-medium bg-[var(--color-special)] text-white`}
          onClick={() => handleShowLeadResponseDetails(response)}
        >
          View Details
        </Button>
        {response?.status && (
          <div className="flex">
            <TagButton
              text={response?.status}
              bgColor="#FF8602"
              textColor="text-white"
              icon={<CircleDotDashed className="text-[#fff] w-4 h-4" />}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default LeadResponseCard;
