'use client';
import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import MyCredits from './_components/module/MyCredits';
import InvoicesBillings from './_components/module/InvoicesBillings';
import MyPayments from './_components/module/MyPayments';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Suspense, useState } from 'react';
import { Loader } from 'lucide-react';
import CreditSummary from './_components/module/CreditSummary';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function MyCreditsPage() {
  const [mycreditsProgress,setMyCreditsProgress]=useState(0)
  const [invoicesBillingsProgress,setInvoicesBillingsProgress]=useState(0)
  const [creditSummaryProgress,setCreditSummaryProgress]=useState(0)
  const [myPayments,setMyPayments]=useState(0)
  const accordionItems = [
    {
      id: 'my-credits',
      title: 'My Credits',
      content: <MyCredits setMyCreditsProgress={setMyCreditsProgress} />,
      progress: mycreditsProgress
    },
    {
      id: 'invoices-billing',
      title: 'Invoices And Billing Details',
      content: <InvoicesBillings setInvoicesBillingsProgress={setInvoicesBillingsProgress} />,
      progress: invoicesBillingsProgress
    },
    {
      id: 'credit-summary',
      title: 'Credit Summary',
      content: <CreditSummary setCreditSummaryProgress={setCreditSummaryProgress} />,
      progress: creditSummaryProgress
    },
    {
      id: 'my-payments',
      title: 'My Payment Details',
      content: <MyPayments setMyPayments={setMyPayments} />,
       progress: myPayments
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
