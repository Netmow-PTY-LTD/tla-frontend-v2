'use client';

import React, { useEffect } from 'react';
import CreditsPurchase from '../UI/CreditPurchse';
import { useGetAllCreditPackagesQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { Loader } from 'lucide-react';
import { BillingTransactionDetails } from '../UI/BillingTransactionTable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const MyCredits = ({ setMyCreditsProgress }) => {
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
          {/* <p className="text-gray-600 mb-2">
            Credits are used to contact customers on The Law App. A small fee,
            paid in credits, is charged for each customer you contact.
            Learn
            more about credits and our charges in the{' '}
            <span className="text-[#00C3C0] hover:underline cursor-pointer">
              Help Centre
            </span>
          </p> */}
          <Accordion
            type="single"
            collapsible
            className="w-full"
          // defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>What are credits?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Credits are the currency used within our platform to access
                  premium features and services. You can purchase credits
                  through various subscription plans or one-time payments. If
                  you see a job that you like and you want to get in contact
                  with that customer, then you use credits to purchase their
                  contact details (you will receive their personal phone number
                  and email address). The amount of credits required to contact
                  a customer varies depending on the potential value of the job
                  e.g. you will need less credits to contact a customer looking
                  for a cleaner once a month for a 1 bedroomed flat than a
                  customer looking for a cleaner once a week for a 5 bedroomed
                  house.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is the starter pack?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  The starter pack is the only way to get started and trial
                  properly. It provides enough credits to contact roughly 10
                  customers and is designed so that you get hired at least once
                  and get a great return on your investment. We’re so confident
                  that you’ll get hired at least once from the starter pack that
                  we offer a full Get Hired Guarantee. We also offer a massive
                  20% discount off the standard price.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What is the Get Hired Guarantee?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  The Get Hired Guarantee is there as we’re so confident that
                  you’ll get hired at least once that if you don’t, we’ll return
                  all of the credits so you can try again.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
              {packageData?.data.filter((pkg) => pkg.price != 0)?.map((creditPackage) => (
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
          <BillingTransactionDetails
            setMyCreditsProgress={setMyCreditsProgress}
          />
        </div>
      </div>
    </div>
  );
};

export default MyCredits;
