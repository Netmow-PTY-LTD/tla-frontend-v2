import React from 'react';

const MyPayments = () => {
  return (
    <div className="w-full">
      <div className="mb-6 ">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Saved Card</h2>
        <p className="text-gray-600 ">
          We don't have any payment information for you yet.
          <br />
          <span className="text-[#00C3C0] hover:underline cursor-pointer">
             Click here to add a card
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default MyPayments;
