'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Suspense, useState } from 'react';
import { Loader } from 'lucide-react';
import EliteProSubscription from './_components/module/MyEliteProSubscription';




const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function MyCreditsPage() {




  return (
    <div>
      <Elements stripe={stripePromise}>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-10">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-gray-500">
                <Loader /> Loading...
              </span>
            </div>
          }
        >
         
          <EliteProSubscription />,
        </Suspense>
      </Elements>
    </div>
  );
}
