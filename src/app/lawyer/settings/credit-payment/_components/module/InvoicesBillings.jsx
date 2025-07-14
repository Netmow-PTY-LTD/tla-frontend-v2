import React from 'react';
import InvoicingForm from '../UI/InvoicingForm';

// import { CreditTransactionLog } from '../UI/CreditTransactionLog';

const InvoicesBillings = ({setInvoicesBillingsProgress}) => {
  return (
    <div className="w-full">
      <InvoicingForm setInvoicesBillingsProgress={setInvoicesBillingsProgress} />
      {/* <div className="mt-8">
        <CreditTransactionLog />
      </div> */}
    </div>
  );
};

export default InvoicesBillings;
