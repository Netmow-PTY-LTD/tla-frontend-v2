'use client';

import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';
import SubscriptionPurchase from '../UI/subscriptionPurchase';
import { SubscriptionTransactionDetails } from '../UI/SubscriptionTransactionDetails';
import { useGetAllSubscriptionsQuery } from '@/store/features/admin/subcriptionsApiService';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import SubscriptionCard from '../UI/SubscriptionCard';



const MySubscription = () => {
  const {
    data: subscriptionData,
    isError,
    isLoading,
  } = useGetAllSubscriptionsQuery();

  const {
    data: userInfo,
    isLoading: userLoading,
    isError: userError,
    error: userErrorMessage,
    refetch: userRefetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  const mySubscription = userInfo?.data?.profile?.subscriptionId || null;

  console.log('My Subscription ID:', mySubscription);




  return (
    <div className="w-full border-none bg-[#F3F3F3] p-[10px] rounded-[5px] ">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-6">
          <h2 className="heading-lg font-bold text-gray-900 mb-2">
            My Subscription
          </h2>
          <p className="text-gray-600 mb-2">
            Manage your subscription plans and view details about your current
            subscription status.
          </p>
        </div>

        <div>

          <div className="mb-4">
            {mySubscription ? (
              <SubscriptionCard subscription={mySubscription} />
            ) : (
              <p className="text-gray-500 text-center py-4">
                You do not have an active subscription.
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
                <SubscriptionPurchase
                  key={subscription?._id}
                  subscriptionPlan={subscription}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 bg-gray-50 rounded-lg shadow-sm p-5">
              No subscription plans available at the moment.
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

export default MySubscription;
