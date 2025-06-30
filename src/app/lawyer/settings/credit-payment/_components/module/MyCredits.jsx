'use client';

import React from 'react';
import CreditsPurchase from '../UI/CreditPurchse';
import { useGetAllCreditPackagesQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { Loader } from 'lucide-react';
import { CreditTransactionLog } from '../UI/CreditTransactionLog';
import { BillingTransactionDetails } from '../UI/BillingTransactionTable';

const MyCredits = () => {
  const {
    data: packageData,
    isError,
    isLoading,
  } = useGetAllCreditPackagesQuery();

  return (
    <div className="w-full ">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-6">
          <h2 className="heading-lg font-bold text-gray-900 mb-2">
            My credits
          </h2>
          <p className="text-gray-600 mb-2">
            Credits are used to contact customers on LawApp. A small fee, paid
            in credits, is charged for each customer you contact. Learn more
            about credits and our charges in the{' '}
            <span className="text-[#00C3C0] hover:underline cursor-pointer">
              Help Centre
            </span>
            .
          </p>
          <p className="text-[#34495E] font-semibold mb-4">
            We charge a small fee for each customer you contact on Bark. Buy a
            pack of 50 credits and get 20% OFF
          </p>
        </div>

        <div>
          {isLoading ? (
            <div className=" text-sm flex justify-center items-center ">
              <Loader /> Loading...
            </div>
          ) : isError ? (
            <div className="text-red-500 text-sm">
              Failed to load credit packages. Please try again.
            </div>
          ) : packageData?.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {packageData?.data?.map((creditPackage) => (
                <CreditsPurchase
                  key={creditPackage?._id}
                  creditPackage={creditPackage}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 bg-gray-50 rounded-lg shadow-sm p-5">
              We don't have any credit packages available at the moment.
              <br />
              <span className="text-[#00C3C0] hover:underline cursor-pointer inline-block mt-2">
                Please check back later.
              </span>
            </div>
          )}
        </div>
        <div className="mt-8">
          <BillingTransactionDetails />
        </div>
      </div>
    </div>
  );
};

export default MyCredits;
