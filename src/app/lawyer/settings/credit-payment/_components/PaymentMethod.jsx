import React, { useState } from 'react';
import CardDisplay from './UI/CardDisplay';
import { useRemovePaymentMethodMutation } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';

const PaymentMethod = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [removeCard] = useRemovePaymentMethodMutation();

  const handleRemoveCard = async (paymentMethodId) => {
    try {
      const result = await removeCard(paymentMethodId).unwrap();
      if (result.success) {
        showSuccessToast(result?.message);
      } else {
        showErrorToast(result?.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  return (
    <div className=" bg-gray-50  p-4 rounded-lg">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          My Saved Card{' '}
          <button
            className="text-sm ml-2 text-red-600 hover:underline focus:outline-none"
            onClick={() => setIsOpen(true)} // ✅ FIXED
          >
            Remove
          </button>
        </h1>

        <div className="flex flex-col  gap-6 items-start">
          <CardDisplay
            cardLastFour={card?.cardLastFour}
            expiryMonth={card?.expiryMonth}
            expiryYear={card?.expiryYear}
          />
        </div>
      </div>
      <ConfirmationModal
        onConfirm={() => handleRemoveCard(card?.paymentMethodId)}
        open={isOpen}
        onOpenChange={setIsOpen}
        description="Are you sure you want to remove this card?"
      />
    </div>
  );
};

export default PaymentMethod;
