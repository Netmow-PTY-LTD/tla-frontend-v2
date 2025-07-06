import React from 'react';
import { CreditTransactionLog } from '../UI/CreditTransactionLog';



const CreditSummary = () => {
  return (
    <div className="w-full">
   
      <div className="mt-8">
        <CreditTransactionLog />
      </div>
    </div>
  );
};

export default CreditSummary;
