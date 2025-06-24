'use client';
import React, { useState } from 'react';

import AddCardModal from '../modal/AddCardModal';
import {
  useAddPaymentMethodMutation,
  useGetPaymentMethodQuery,
  useTransactionHistoryQuery,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import PaymentMethod from '../PaymentMethod';
import { Loader } from 'lucide-react';
import { CreditTransactionLog } from '../UI/CreditTransactionLog';

const MyPayments = () => {
  const [open, setOpen] = useState(false);
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const { data, isError, isLoading } = useGetPaymentMethodQuery();

  const card = data?.data || null;

  const handleCardAdded = async (paymentMethodId) => {
    const result = await addPaymentMethod({ paymentMethodId }).unwrap();
    if (result.success) {
      showSuccessToast(result?.message);
    } else {
      showErrorToast(result?.message);
    }
    try {
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };
  return (
    <div className="max-w-[900px] mx-auto p-4">
      <div>
        {isLoading ? (
          <p className="text-gray-600 flex justify-center items-center">
            <Loader /> <br /> <span>Loading ...</span>
          </p>
        ) : isError ? (
          <p className="text-red-500">Failed to load payment method.</p>
        ) : !card ? (
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
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
            />
          </div>
        ) : (
          <PaymentMethod card={card} />
        )}
      </div>

      {/* transaction list*/}

      <div>{card && <CreditTransactionLog />}</div>
    </div>
  );
};

export default MyPayments;
