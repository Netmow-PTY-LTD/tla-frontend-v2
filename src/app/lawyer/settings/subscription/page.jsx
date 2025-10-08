'use client';
import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Suspense, useState } from 'react';
import { Loader } from 'lucide-react';
import MySubscription from './_components/module/MySubscription';



const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function MyCreditsPage() {
  const [subscriptionProgress, setSubscriptionProgress] = useState(0);

  const accordionItems = [
    {
      id: 'my-subscription',
      title: 'My Subscription',
      content: <MySubscription setSubscriptionProgress={setSubscriptionProgress} />,
      progress: subscriptionProgress
    },
  ];

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
          <DynamicAccordion items={accordionItems} />
        </Suspense>
      </Elements>
    </div>
  );
}
