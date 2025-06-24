import React from 'react';
import CardDisplay from './UI/CardDisplay';

const PaymentMethod = ({ card }) => {
  return (
    <div className=" bg-gray-50  p-4 rounded-lg">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          My Saved Card
        </h1>

        <div className="flex flex-col  gap-6 items-start">
          <CardDisplay
            cardLastFour={card?.cardLastFour}
            expiryMonth={card?.expiryMonth}
            expiryYear={card?.expiryYear}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
