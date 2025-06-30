import React from 'react';
import InvoicingForm from '../UI/InvoicingForm';
import { BillingTransactionDetails } from '../UI/BillingTransactionTable';

const InvoicesBillings = () => {
  return (
    <div className="w-full">
      <InvoicingForm />
      <div className="mt-8">
        <BillingTransactionDetails />
      </div>
    </div>
  );
};

export default InvoicesBillings;
