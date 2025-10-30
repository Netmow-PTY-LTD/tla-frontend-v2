import { useGetNextOfferQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import Link from 'next/link';
import React from 'react';

export default function GetStartedCard() {
  const { data, isLoading } = useGetNextOfferQuery();
  const creditPackage = data?.data || {};
  return (
    <div className="flex justify-center items-center mt-5 w-full">
      <div className="relative border-t shadow-md shadow-black/10 rounded-[10px] bg-white w-full max-w-full md:max-w-[70%]">
        {isLoading ? (
          <div className="p-4 space-y-4 animate-pulse">
            {/* Skeleton Badge */}
            <div className="absolute right-0 top-0 p-2">
              <div className="h-6 w-32 bg-gray-200 rounded-tr-[10px] rounded-bl-[10px]" />
            </div>

            {/* Skeleton Content */}
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded mt-4" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            {/* Badge */}
            {creditPackage.discountPercentage > 0 && (
              <div className="absolute right-0 top-0 p-2 bg-[#00C3C0] rounded-tr-[10px] rounded-bl-[10px]">
                <h2 className="text-sm font-medium text-white whitespace-nowrap">
                  {creditPackage.discountPercentage}% OFF {creditPackage.name}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-2">
              <h4 className="text-black font-medium text-sm">Get Started</h4>
              <h2 className="text-[#00C3C0] font-semibold text-lg heading">
                {creditPackage.name}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <p className="text-sm text-gray-700 leading-snug">
                  Respond to up to {creditPackage.credit} client
                  {creditPackage.credit > 1 ? 's' : ''}.{' '}
                  {creditPackage.discountPercentage > 0 && (
                    <span className="text-[#00C3C0] font-medium">
                      {creditPackage.discountPercentage}% OFF
                    </span>
                  )}{' '}
                  and a get hired guarantee.
                </p>
                <Link href="/lawyer/settings/credit-payment?section=my-credits">
                  <button className="text-[#00C3C0] text-sm font-medium hover:underline">
                    Learn more
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
