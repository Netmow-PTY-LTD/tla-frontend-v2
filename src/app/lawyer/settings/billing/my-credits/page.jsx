import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import MyCredits from './_components/MyCreadits';
import InvoicesBillings from './_components/InvoicesBillings';
import MyPayments from './_components/MyPayments';

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
      <DynamicAccordion items={accordionItems} />
    </div>
  );
}
