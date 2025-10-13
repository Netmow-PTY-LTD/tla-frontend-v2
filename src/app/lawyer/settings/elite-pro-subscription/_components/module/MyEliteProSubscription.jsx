'use client';

import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';

import { SubscriptionTransactionDetails } from '../UI/SubscriptionTransactionDetails';
import { useGetAllEliteProSubscriptionsQuery } from '@/store/features/admin/eliteProSubscriptionsApiService';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import EliteProSubscriptionPurchase from '../UI/EliteProSubscriptionPurchase';
import SubscriptionCard from '../../../subscription/_components/UI/SubscriptionCard';
import EliteProSubscriptionCard from '../UI/EliteProSubscriptionCard';

const EliteProSubscription = () => {
  const {
    data: subscriptionData,
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
    <div className="w-full border-none bg-[#F3F3F3] p-[10px] rounded-[5px] ">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-6">
          <h2 className="heading-lg font-bold text-gray-900 mb-2">
            Elite Pro Subscription
          </h2>
          <p className="text-gray-600 mb-2">
            Explore and manage your Elite Pro subscription plans. Stay updated
            with the latest features and benefits tailored for you.
          </p>
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
          ) : subscriptionData?.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {subscriptionData?.data?.map((subscription) => (
                <EliteProSubscriptionPurchase
                  key={subscription?._id}
                  subscriptionPlan={subscription}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 bg-gray-50 rounded-lg shadow-sm p-5">
              No Elite Pro subscription plans available at the moment.
              <br />
              <span className="text-[#00C3C0] hover:underline cursor-pointer inline-block mt-2">
                Please check back later.
              </span>
            </div>
          )}
        </div>
        <div className="mt-8">
          <SubscriptionTransactionDetails

          />
        </div>
      </div>
    </div>
  );
};

export default EliteProSubscription;
