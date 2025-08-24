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
  Star,
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
  isHiredLead
}) => {
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const profileType = lawyer?.profile?.profileType;
  const badge =
    profileType
      ?.replace(/[^a-zA-Z0-9]+/g, ' ')
      ?.split(' ')
      ?.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      ?.join('') + ' Lawyer';

  const getTruncatedText = (text, maxLength) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const [requestLawyer, { isLoading }] = useRequestLawyerMutation();

  const handleRequest = async (message) => {
    const payload = {
      leadId: id,
      toRequestId: lawyer?._id,
      message,
    };

    try {
      const response = await requestLawyer(payload).unwrap();
      console.log('Response:', response);
      if (response?.success) {
        refetch();
        showSuccessToast(response?.message || 'Request sent successfully');
        setOpenRequestModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast(error?.data?.message || 'Failed to send request.');
    }
  };

  return (
    <>
      <Card className={`w-full max-w-full mx-auto flex flex-col p-5`}>
        <div className="flex justify-between gap-5">
          <div className="flex-shrink-0">
            <figure className="w-[180px] h-[180px] overflow-hidden flex-shrink-0 border rounded-lg">
              <Image
                src={`${lawyer?.profile?.profilePicture ?? userDummyImage}`}
                alt={lawyer?.profile?.name ?? ''}
                width={180}
                height={180}
                priority
                className="w-full h-full object-cover"
              />
            </figure>
          </div>
          <div className="flex-1 border-r border-[#F3F3F3] border-opacity-65 pr-4">
            <div className="w-full">
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 ">
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
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-sm">(1)</span>
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
              <p
                className="text-[#6e6e6e] text-[13px] mt-[10px]"
                dangerouslySetInnerHTML={{
                  __html: getTruncatedText(lawyer?.profile?.bio, 200),
                }}
              ></p>
            )}
            <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg flex justify-between gap-4">
              <div className="flex-shrink-0">
                <h4 className={`font-medium mb-1 text-[16px] text-gray-500`}>
                  Me
                </h4>
                <p className={`text-[var(--color-black)] font-medium text-sm`}>
                  You viewed this profile.
                </p>
              </div>
              <div className="flex-shrink-0 text-sm text-gray-400">
                19 Aug, 10:39
              </div>
            </div>
            <Link
              href={`/profile/${lawyer?.profile?.slug}`}
              target="_blank"
              className="text-blue-500 text-[14px] font-medium mt-2 flex items-center gap-1"
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
                onClick={() => setOpenRequestModal(true)}
                disabled={isLoading || isHiredLead || lawyer?.isRequested} // Disable if loading or already requested
              >
                {isLoading ? (
                  <div className="flex items-center gap-1">
                    <Loader />
                    <span>Requesting...</span>
                  </div>
                ) : isHiredLead? ('Alredy Hired'): lawyer?.isRequested ? (
                  'Requested'
                ) : (
                  'Request Reply'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <RequestMessageModal
        onOpenChange={setOpenRequestModal}
        open={openRequestModal}
        handleRequest={handleRequest}
      />
    </>
  );
};

export default LawyerCard;
