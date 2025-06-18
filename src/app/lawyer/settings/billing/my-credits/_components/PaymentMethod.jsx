import React from 'react';
import CardDisplay from './UI/CardDisplay';
import ChangeCardButton from './UI/ChangeCardButton';

const PaymentMethod = () => {
  return (
    <div className=" bg-gray-50 flex items-center justify-center p-4 rounded-lg">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          My Saved Card
        </h1>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <CardDisplay />
          <ChangeCardButton />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
