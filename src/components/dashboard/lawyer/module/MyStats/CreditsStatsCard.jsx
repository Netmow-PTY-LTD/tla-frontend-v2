'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetUserCreditStatsQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { CheckCircle, CreditCard, Flame, Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function CreditsStatsCard() {
  const { data } = useGetUserCreditStatsQuery();
  const creditStats = data?.data || {};
  return (
    <Card className="w-full bg-white shadow-sm rounded-2xl">
      <div className="flex justify-between items-center gap-4 p-4">
        <div className="w-full text-center md:text-left">
          <h3 className="heading-md font-semibold text-black mb-1">
            My Credits Overview
          </h3>
          <p className="text-xs text-gray-500">
            Track your credit usage and balance
          </p>
        </div>
        <Link href="/lawyer/settings/credit-payment?section=my-credits">
          <Button
            variant="primary"
            size="sm"
            className="bg-[var(--secondary-color)] text-white"
          >
            Buy Credit
          </Button>
        </Link>
      </div>

      <hr className="border-t  border-[#D9D9D9]" />
      <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-3 ">
        {/* Total Purchased Credits */}
        <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            {/* Icon for purchased credits */}
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h4 className="text-xl font-bold text-black">
              {creditStats?.totalPurchasedCredits}
            </h4>
          </div>
          <p className="text-xs text-gray-600 mt-1">Total Credits Purchase</p>
        </div>

        {/* Total Used Credits */}
        <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            {/* Icon for used credits */}
            <Flame className="w-5 h-5 text-orange-500" />
            <h4 className="text-xl font-bold text-black">
              {creditStats?.totalUsedCredits}
            </h4>
          </div>
          <p className="text-xs text-gray-600 mt-1">Total Used Credits</p>
        </div>

        {/* Remaining Credits */}
        {/* <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
           
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="text-xl font-bold text-black">
                {creditStats?.remainingCredits}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">Remaining Credits</p>
          </div> */}

        {/* Current Credits */}
        <div className="bg-[#F5F6F9] flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-1">
            {/* Icon for current credits */}
            <Wallet className="w-5 h-5 text-purple-500" />
            <h4 className="text-xl font-bold text-black">
              {creditStats?.currentCredits}
            </h4>
          </div>
          <p className="text-xs text-gray-600 mt-1">Available Credits</p>
        </div>
      </div>
    </Card>
  );
}
