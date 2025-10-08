import React from 'react';
import { CreditTransactionLog } from '../UI/CreditTransactionLog';



const CreditSummary = ({setCreditSummaryProgress}) => {
  return (
    <div className="w-full">
   
      <div className="mt-8">
        <CreditTransactionLog setCreditSummaryProgress={setCreditSummaryProgress} />
      </div>
    </div>
  );
};

export default CreditSummary;
