'use client';
import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import MyCredits from './_components/module/MyCredits';
import InvoicesBillings from './_components/module/InvoicesBillings';
import MyPayments from './_components/module/MyPayments';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Suspense } from 'react';
import { Loader } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function MyCreditsPage() {
  const accordionItems = [
    { id: 'my-credits', title: 'My Credits', content: <MyCredits /> },
    {
      id: 'invoices-billing',
      title: 'Invoices And Billing Details',
      content: <InvoicesBillings />,
    },
    { id: 'my-payments', title: 'My Payment Details', content: <MyPayments /> },
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
          <DynamicAccordion items={accordionItems} useQueryParam />
        </Suspense>
      </Elements>
    </div>
  );
}
