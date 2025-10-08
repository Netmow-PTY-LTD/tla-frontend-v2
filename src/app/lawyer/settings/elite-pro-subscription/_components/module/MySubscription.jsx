'use client';

import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';
import SubscriptionPurchase from '../UI/subscriptionPurchase';
import { SubscriptionTransactionDetails } from '../UI/SubscriptionTransactionDetails';
import { useGetAllSubscriptionsQuery } from '@/store/features/admin/subcriptionsApiService';

const EliteProSubscription = ({ setSubscriptionProgress }) => {
  const {
    data: subscriptionData,
    isError,
    isLoading,
  } = useGetAllSubscriptionsQuery();



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
                <SubscriptionPurchase
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
            setSubscriptionProgress={setSubscriptionProgress}
          />
        </div>
      </div>
    </div>
  );
};

export default EliteProSubscription;
