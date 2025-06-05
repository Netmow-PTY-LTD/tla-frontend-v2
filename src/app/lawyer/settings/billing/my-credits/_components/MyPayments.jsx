'use client';
import React, { useState } from 'react';
import AddAccreditationModal from './modal/AddCardDetailsModal';

const MyPayments = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-6 ">
        <h3 className="heading-lg font-bold text-gray-900 mb-4">
          My Saved Card
        </h3>
        <div className="text-gray-600 bg-gray-50 rounded-lg shadow-sm p-5">
          We don't have any payment information for you yet.
          <br />
          <span
            className="text-[#00C3C0] hover:underline cursor-pointer inline-block mt-2"
            onClick={() => setOpen(true)}
          >
            Click here to add a card
          </span>
          .
        </div>
        <AddAccreditationModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default MyPayments;
