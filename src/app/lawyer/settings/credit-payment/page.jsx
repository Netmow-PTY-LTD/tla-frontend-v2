'use client';
import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import MyCredits from './_components/module/MyCredits';
import InvoicesBillings from './_components/module/InvoicesBillings';
import MyPayments from './_components/module/MyPayments';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

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
        <DynamicAccordion items={accordionItems} />
      </Elements>
    </div>
  );
}
