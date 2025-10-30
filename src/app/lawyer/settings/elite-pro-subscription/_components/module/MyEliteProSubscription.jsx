'use client';

import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';

import { SubscriptionTransactionDetails } from '../UI/SubscriptionTransactionDetails';
import { useGetAllEliteProSubscriptionsQuery } from '@/store/features/admin/eliteProSubscriptionsApiService';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import EliteProSubscriptionPurchase from '../UI/EliteProSubscriptionPurchase';
import EliteProSubscriptionCard from '../UI/EliteProSubscriptionCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const EliteProSubscription = () => {
  const {
    data: elliteProSubscriptionData,
    isError,
    isLoading,
  } = useGetAllEliteProSubscriptionsQuery();

  const {
    data: userInfo,
    isLoading: userLoading,
    isError: userError,
    error: userErrorMessage,
    refetch: userRefetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  const MyElitePro = userInfo?.data?.profile?.eliteProSubscriptionId || null;

  console.log('My Elite Pro Subscription:', MyElitePro);

  return (
    <div className="w-full border-none bg-[#F3F3F3] py-8 px-[15px] rounded-[5px] ">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-6">
          <h2 className="heading-lg font-bold text-gray-900 mb-2">
            Elite Pro Subscription
          </h2>
          <p className="text-gray-600 mb-2 text-sm">
            Explore and manage your Elite Pro subscription plans. Stay updated
            with the latest features and benefits tailored for you.
          </p>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            // defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the Elite Pro Plan?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  The Elite Pro Plan boosts your search visibility, placing your
                  profile at the top of listings when clients post new cases. It
                  helps you stand out and attract more client inquiries faster.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Does the Elite Pro Plan increase my client contact limit?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  The Elite Pro Plan focuses on visibility and ranking, not
                  contact limits. You’ll still have the same contact limit as
                  your active subscription, but you’ll appear higher in search
                  results to get more inquiries.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Who should choose the Elite Pro Plan?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  This plan is ideal for experienced professionals or firms who
                  want to maximize exposure, gain more visibility, and be seen
                  first by clients looking for legal services.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <div className="mb-4">
            {MyElitePro ? (
              <EliteProSubscriptionCard subscription={MyElitePro} />
            ) : (
              <p className="text-gray-500 text-center py-4">
                You do not have an active elite pro subscription.
              </p>
            )}
          </div>

          {isLoading ? (
            <div className=" text-sm flex justify-center items-center ">
              <Loader /> Loading...
            </div>
          ) : isError ? (
            <div className="text-red-500 text-sm">
              Failed to load subscription data. Please try again.
            </div>
          ) : elliteProSubscriptionData?.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {elliteProSubscriptionData?.data?.map((elitePro) => (
                <EliteProSubscriptionPurchase
                  key={elitePro?._id}
                  subscriptionPlan={elitePro}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 bg-gray-50 rounded-lg p-5">
              No Elite Pro subscription plans available at the moment.
              <br />
              <span className="text-[#00C3C0] hover:underline cursor-pointer inline-block mt-2">
                Please check back later.
              </span>
            </div>
          )}
        </div>
        <div className="mt-8">
          <SubscriptionTransactionDetails />
        </div>
      </div>
    </div>
  );
};

export default EliteProSubscription;
