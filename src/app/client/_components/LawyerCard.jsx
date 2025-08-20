import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BadgeCent,
  BadgeCheck,
  CircleAlert,
  List,
  Loader,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userDummyImage } from '@/data/data';
import { useRequestLawyerMutation } from '@/store/features/client/ClientApiServices';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import Link from 'next/link';
import { RequestMessageModal } from './modal/RequestMessageModal';

const LawyerCard = ({
  lawyer,
  isExpanded,
  id,
  lawyerOnlineStatus,
  refetch,
}) => {
  const [openRequestModal,setOpenRequestModal]=useState(false)
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
        refetch();
        showSuccessToast(response?.message || 'Request sent successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast(error?.data?.message || 'Failed to send request.');
    }
  };

  return (
   <>
    <Card className={`w-full max-w-full mx-auto flex flex-col p-5`}>
      <div className="flex justify-between gap-4">
        <div className="flex-shrink-0">
          <figure className="max-w-[180px] max-h-[180px] overflow-hidden flex-shrink-0 border rounded-lg">
            <Image
              src={`${lawyer?.profile?.profilePicture ?? userDummyImage}`}
              alt={lawyer?.profile?.name ?? ''}
              width={200}
              height={200}
              priority
              className="w-full h-full object-cover"
            />
          </figure>
        </div>
        <div className="flex-1 border-r border-[#F3F3F3] border-opacity-65">
          <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 ">
              <div className="flex w-full">
                <div className="flex items-center gap-2">
                  {badge && badge?.toLowerCase() !== 'basic lawyer' && (
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
                  )}
                  <div
                    className={`font-medium mb-1 ${
                      isExpanded ? 'heading-base' : 'text-[18px]'
                    }`}
                  >
                    {lawyer?.profile?.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs ">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        lawyerOnlineStatus[lawyer?._id]
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {lawyer?.profile?.serviceIds?.length > 0 && (
            <div className="flex flex-wrap gap-2 pr-3 my-3">
              {lawyer?.profile?.serviceIds?.map((service, i) => (
                <span
                  key={i}
                  className="inline-flex justify-center items-center gap-2 rounded-[30px] border px-2 py-1 text-[12px]"
                >
                  {service?.name}
                </span>
              ))}
            </div>
          )}

          {lawyer?.profile?.bio && lawyer?.profile?.bio !== '' && (
            <p className="text-[#6e6e6e] mt-[10px]">{lawyer?.profile?.bio}</p>
          )}
          <Link
            href={`/profile/${lawyer?.profile?.slug}`}
            className="text-blue-500 text-[14px] font-medium mt-2 flex items-center gap-2"
          >
            <span>View Profile</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex flex-col justify-end items-center">
          <div className="flex flex-col p-3 gap-3 sm:gap-0">
            <Button
              className={`px-4 py-2 w-full sm:w-auto rounded-lg ${
                isExpanded ? 'text-[14px]' : 'text-[12px]'
              } font-medium bg-[var(--color-special)] text-white ${
                lawyer?.isRequested ? 'bg-[var(--primary-color)]' : ''
              }`}
              // onClick={handleRequest}
              onClick={()=>setOpenRequestModal(true)}
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
                'Request Reply'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>

    <RequestMessageModal onOpenChange={setOpenRequestModal} open={openRequestModal}/>
   
   </>
  );
};

export default LawyerCard;
