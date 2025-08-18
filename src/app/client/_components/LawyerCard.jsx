import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  BadgeCent,
  BadgeCheck,
  CircleAlert,
  List,
  Loader,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userDummyImage } from '@/data/data';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { useRequestLawyerMutation } from '@/store/features/client/ClientApiServices';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const LawyerCard = ({ lawyer, isExpanded, id, lawyerOnlineStatus }) => {
  const profileType = lawyer?.profile?.profileType;
  const badge =
    profileType
      ?.replace(/[^a-zA-Z0-9]+/g, ' ')
      ?.split(' ')
      ?.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      ?.join('') + ' Lawyer';

  const [requestLawyer, { isLoading }] = useRequestLawyerMutation();

  const handleRequest = async () => {
    const payload = {
      leadId: id,
      toRequestId: lawyer?._id,
      message: 'Hello, I am interested in your services.',
    };

    try {
      const response = await requestLawyer(payload).unwrap();
      console.log('Response:', response);
      if (response?.success) {
        showSuccessToast(response?.message || 'Request sent successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast(error?.data?.message || 'Failed to send request.');
    }
  };

  return (
    <Card
      className={`w-full max-w-full mx-auto flex flex-col`}
      //onClick={() => onViewDetails(user)}
    >
      {/* Header Section */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 p-3">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 ">
          <figure className="w-10 h-10 overflow-hidden flex-shrink-0 border rounded-full">
            <Image
              src={`${lawyer?.profile?.profilePicture ?? userDummyImage}`}
              alt={lawyer?.profile?.name ?? ''}
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
                {lawyer?.profile?.name}
              </div>
              <div
                className={`${
                  isExpanded ? 'text-[13px]' : 'text-[10px]'
                } text-gray-500`}
              >
                {lawyer?.profile?.address ?? ''}
              </div>
              {/* <div className="flex items-center gap-1 text-xs mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    onlineMap[user?.userProfileId?.user?._id]
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                  }`}
                ></span>
                <span className="text-gray-700">
                  {onlineMap[user?.userProfileId?.user?._id]
                    ? 'Online'
                    : 'Offline'}
                </span>
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs ">
          <span
            className={`w-2 h-2 rounded-full ${
              lawyerOnlineStatus[lawyer?._id] ? 'bg-green-500' : 'bg-gray-400'
            }`}
          ></span>
          <span className="text-gray-700">
            {lawyerOnlineStatus[lawyer?._id] ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <hr className="border-[#F3F3F3] border" />
      {(lawyer?.additionalDetails && lawyer?.additionalDetails !== '') ||
      lawyer?.leadPriority?.toLowerCase() === 'urgent' ||
      lawyer?.phone ? (
        <div className="px-3 pt-3 pb-2">
          <div className="flex flex-wrap gap-2">
            {lawyer?.additionalDetails && lawyer?.additionalDetails !== '' && (
              <TagButton
                text="Additional Details"
                bgColor="#004DA61A"
                icon={<List className="text-[#000] w-4 h-4" />}
              />
            )}
            {lawyer?.leadPriority?.toLowerCase() === 'urgent' && (
              <TagButton
                text={lawyer?.leadPriority}
                textColor="text-[#FF8602]"
                bgColor="#FF86021A"
                icon={<Zap className="text-[#FF8602] w-4 h-4" />}
              />
            )}
            {/* {lawyer?.phone && (
              <TagButton
                text="Verified Phone"
                textColor="text-[#00C3C0]"
                bgColor="#00C3C01A"
                icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
              />
            )} */}
          </div>
        </div>
      ) : null}

      {badge && badge?.toLowerCase() !== 'basic lawyer' && (
        <div className="bg-[#F3f3f3] py-2 px-3 rounded-[6px] inline-flex items-center gap-2 mx-3 w-max mt-3">
          <div className="icon">
            <img
              src={
                badge.toLowerCase() === 'premium lawyer'
                  ? '/assets/img/badge.svg'
                  : badge.toLowerCase() === 'expert lawyer'
                  ? '/assets/img/expert.png'
                  : '/assets/img/basic.png'
              }
              width="30"
              height="30"
              alt={badge}
            />
          </div>
          <span className="badge-name badge-name-alt">{badge}</span>
          <span className="text-[12px] text-gray-500">
            {badge?.toLowerCase() === 'premium lawyer'
              ? '(10+ Hired)'
              : badge?.toLowerCase() === 'expert lawyer'
              ? '(5+ Hired)'
              : ''}
          </span>
        </div>
      )}
      {lawyer?.profile?.serviceIds?.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 mt-5 mb-3">
          {lawyer?.profile?.serviceIds?.map((service, i) => (
            <span
              key={i}
              className="inline-flex justify-center items-center gap-2 rounded-[30px] bg-[#F3F3F3] px-2 py-1 text-[13px]"
            >
              {service?.name}
            </span>
          ))}
        </div>
      )}
      {/* {index} */}
      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-3 gap-3 sm:gap-0">
        <Button
          className={`px-4 py-2 w-full sm:w-auto rounded-lg ${
            isExpanded ? 'text-[14px]' : 'text-[12px]'
          } font-medium bg-[var(--color-special)] text-white ${
            lawyer?.isRequested ? 'bg-[var(--primary-color)]' : ''
          }`}
          onClick={handleRequest}
          disabled={isLoading || lawyer?.isRequested} // Disable if loading or already requested
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <Loader />
              <span>Requesting...</span>
            </div>
          ) : lawyer?.isRequested ? (
            'Requested'
          ) : (
            'Request Me'
          )}
        </Button>
      </div>
    </Card>
  );
};

export default LawyerCard;
