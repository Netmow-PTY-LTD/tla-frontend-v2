import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
import Image from 'next/image';
import { BadgeCheck, Ban, CircleAlert, Info, SearchCheck, Zap } from 'lucide-react';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import Link from 'next/link';
import { userDummyImage } from '@/data/data';
import RespondersOnline from './RespondersOnline';
import LeadCloseModal from './modal/LeadCloseModal';
import RatingForm from '../dashboard/my-cases/_components/RatingForm';
import { RatingStars } from './RatingUi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const responsesLeads = [
  {
    id: 1,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 4,
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: 5,
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: 6,
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  {
    id: 7,
    image: 'https://randomuser.me/api/portraits/men/7.jpg',
  },
  {
    id: 8,
    image: 'https://randomuser.me/api/portraits/women/8.jpg',
  },
];

const ClientLeadCard = ({ user, isExpanded }) => {
  const { data: singleLead, isLoading } = useGetSingleLeadQuery(user?._id);
  const [openLeadClosedModal, setOpenLeadClosedModal] = useState(false);
  const [leadId, setLeadId] = useState(false);

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
    <>
      <Card className="w-full max-w-full mx-auto py-3">
        {/* Header Section */}
        {/* <div className="flex flex-wrap bg-[#004DA61A] sm:flex-nowrap items-center gap-3 p-3 rounded-tl-xl rounded-tr-xl">
        <figure className="w-8 h-8 overflow-hidden flex-shrink-0">
          <Image
            src={`${user?.userProfileId?.profilePicture ?? userDummyImage}`}
            alt={user?.userProfileId?.name ?? 'John Doe'}
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
      </div> */}
        {/* <hr className="border-[#F3F3F3] border" /> */}
        {/* Matched Criteria */}
        {/* {(urgentOption?.option ||
        user?.additionalDetails ||
        user?.userProfileId?.phone) && (
        <div className="px-3 pt-3">
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

            {user?.userProfileId?.user?.isPhoneVerified === true && (
              <TagButton
                text="Verified Phone"
                bgColor="#00C3C01A"
                icon={<BadgeCheck className="text-[#00C3C0] w-4 h-4" />}
              />
            )}
          </div>
        </div>
      )} */}

        {/* {singleLead?.data?.status && (
        <div className="px-3 pt-2">
          <TagButton
            text={singleLead?.data?.status}
            bgColor={
              singleLead?.data?.status === 'approved'
                ? '#00C3C01A'
                : singleLead?.data?.status === 'rejected'
                ? '#FF00001A'
                : '#FF86021A'
            }
            textColor={
              singleLead?.data?.status === 'approved'
                ? 'text-[#00C3C0]'
                : singleLead?.data?.status === 'rejected'
                ? 'text-[#FF0000]'
                : 'text-[#FF8602]'
            }
            icon={
              singleLead?.data?.status === 'approved' ? (
                <BadgeCheck className="text-[#00C3C0] w-4 h-4" />
              ) : singleLead?.data?.status === 'rejected' ? (
                <Ban className="text-[#FF0000] w-4 h-4" />
              ) : (
                <CircleAlert className="text-[#FF8602] w-4 h-4" />
              )
            }
          />
        </div>
      )} */}
        {/* Job Description */}
        <div className="p-3 text-center">
          {user?.serviceId?.name && (
            <h3
              className={`font-medium ${isExpanded ? 'heading-md' : 'text-[16px]'
                }`}
            >
              {user?.serviceId?.name}
            </h3>
          )}
          <p className="text-[12px] text-gray-400">
            {user?.createdAt && formatRelativeTime(user?.createdAt)}
          </p>
        </div>
        <div className="p-3 flex justify-center items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <SearchCheck className="w-8 h-8 text-[var(--primary-color)]" />
          </div>
        </div>
        {/* <div className="p-3">
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
      </div> */}

        <div className="p-3 text-center">
          <p className="text-[15px] text-gray-500">
            We have got lawyers ready and available!
          </p>
        </div>

        {/* Footer Section */}

        <div className="flex flex-col sm:flex-row justify-center items-center p-3 gap-3 sm:gap-0">
          <Link
            className={`px-4 py-2.5 w-full sm:w-auto rounded-lg ${isExpanded ? 'heading-base' : 'text-[12px] '
              } font-medium bg-[var(--color-special)] text-white hover:bg-gray-950 transition`}
            href={`/client/dashboard/my-cases/${user?._id}`}
          >
            View Lawyers
          </Link>
        </div>


        {
          user?.hireStatus !== 'not_requested' ? (
            <div className="flex flex-col items-center ">
              <span className="px-3 py-1 text-sm font-medium 00 rounded-full capitalize ">
                {
                  user?.hireStatus
                }
              </span>
              {
                user?.hireStatus === "hired" && user?.hiredLawyerRating?.rating && <RatingStars rating={user?.hiredLawyerRating?.rating} showNumber={false} />
              }

            </div>
          ) : <></>
        }
        {user?.closeStatus === 'closed' ? (
          <div className='flex flex-col items-center gap-3'>
            <div className="text-center">
              <span className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-full">
                Closed
              </span>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-full shadow-sm border border-indigo-700 hover:bg-indigo-700 hover:shadow-md transition-all duration-200 ease-in-out"
                  >
                    Repost Case
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-center">
                  <p>
                    Reposting this case will make it visible to lawyers again and allow them to respond with new offers.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>


        ) : (
          <>

            <div className="flex justify-center items-center p-3 gap-3">
              <button
                onClick={() => {
                  setLeadId(user?._id);
                  setOpenLeadClosedModal(true);
                }}
                className="text-blue-500"
              >
                Close case
              </button>




            </div>
          </>
        )}
      </Card>

      <LeadCloseModal
        leadId={leadId}
        onOpenChange={setOpenLeadClosedModal}
        open={openLeadClosedModal}
      />
    </>
  );
};

export default ClientLeadCard;
