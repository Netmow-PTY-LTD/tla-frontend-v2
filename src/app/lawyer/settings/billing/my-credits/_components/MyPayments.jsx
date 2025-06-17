'use client';
import React, { useState } from 'react';

import AddCardModal from '../../_components/AddCardModal';
import { useAddPaymentMethodMutation } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const MyPayments = () => {
  const [open, setOpen] = useState(false);
  const [addPaymentMethod] = useAddPaymentMethodMutation();

  const handleCardAdded = async (paymentMethodId) => {
    console.log('New card paymentMethodId:', paymentMethodId);
    const result = await addPaymentMethod({ paymentMethodId }).unwrap();
    console.log('restlt ==>', result);
    if (result.success) {
      showSuccessToast(result?.message || ' update successful');
    }
    try {
    } catch {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };
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

        <AddCardModal
          open={open}
          setOpen={setOpen}
          onCardAdded={handleCardAdded}
          email="test@gmail.com"
        />
      </div>
    </div>
  );
};

export default MyPayments;
