import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  BadgeCheck,
  CircleAlert,
  CircleDotDashed,
  Star,
  Zap,
} from 'lucide-react';
import { useGetSingleLeadQuery } from '@/store/features/lawyer/LeadsApiService';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/helpers/formatTime';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { userDummyImage } from '@/data/data';
import { getTruncatedText } from '@/helpers/getTruncatedText';
import RatingUI, { RatingStars } from './RatingUi';

const LeadResponseCard = ({
  handleShowLeadResponseDetails,
  response,
  isExpanded,
  onlineMap,
}) => {
  const { data: singleLeadResponse, isLoading } = useGetSingleLeadQuery(
    response?._id
  );

  const badge = response?.lawyerBadge;

console.log('response',response?.responseBy?.avgRating)


  return (
    <>
      <Card className={`w-full max-w-full mx-auto flex flex-col p-5`}>
        <div className="flex justify-between gap-5">
          <div className="flex-shrink-0">
            <figure className="w-[150px] h-[150px] overflow-hidden flex-shrink-0 border">
              <Image
                src={`${response?.responseBy?.profilePicture ?? userDummyImage
                  }`}
                alt={response?.responseBy?.name ?? ''}
                width={150}
                height={150}
                priority
                className="object-cover w-full h-full"
              />
            </figure>
          </div>
          <div className="flex-1">
            <div className="w-full">
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 ">
                <div className="flex flex-col w-full">
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
                      className={`font-medium mb-1 ${isExpanded ? 'heading-base' : 'text-[18px]'
                        }`}
                    >
                      {response?.responseBy?.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs ">
                      <span
                        className={`w-2 h-2 rounded-full ${onlineMap[response?.responseBy?.user?._id]
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                          }`}
                      ></span>
                    </div>
                  </div>
                  <div
                    className={`${isExpanded ? 'text-[13px]' : 'text-[10px]'
                      } text-gray-500`}
                  >
                    {response?.responseBy?.address ?? ''}
                  </div>
                </div>
          
              
                  <RatingStars rating={response?.responseBy?.avgRating} showNumber={false} /> 

              </div>
            </div>
            {response?.responseBy?.serviceIds?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {response?.responseBy?.serviceIds?.map((service, i) => (
                  <span
                    key={i}
                    className="inline-flex justify-center items-center gap-2 rounded-[30px] border px-2 py-1 text-[13px]"
                  >
                    {service?.name}
                  </span>
                ))}
              </div>
            )}

            {response?.responseBy?.bio && response?.responseBy?.bio !== '' && (
              <p
                className="text-[#6e6e6e] text-[13px] mt-[10px]"
                dangerouslySetInnerHTML={{
                  __html: getTruncatedText(response?.responseBy?.bio, 200),
                }}
              ></p>
            )}
            <div className="flex flex-col sm:flex-row items-center py-3 gap-4">
              <Button
                className={`px-4 py-2 w-full sm:w-auto rounded-lg ${isExpanded ? 'text-[14px]' : 'text-[12px] '
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
          </div>
        </div>
      </Card>
    </>
  );
};

export default LeadResponseCard;
