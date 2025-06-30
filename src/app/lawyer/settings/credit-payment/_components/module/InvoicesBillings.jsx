import React from 'react';
import InvoicingForm from '../UI/InvoicingForm';

import { CreditTransactionLog } from '../UI/CreditTransactionLog';

const InvoicesBillings = () => {
  return (
    <div className="w-full">
      <InvoicingForm />
      <div className="mt-8">
        <CreditTransactionLog />
      </div>
    </div>
  );
};

export default InvoicesBillings;
