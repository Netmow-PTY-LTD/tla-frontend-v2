'use client';

import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Modal } from '@/components/UIComponents/Modal'; // Assuming same Modal component used

const AddCardModal = ({ open, setOpen, onCardAdded }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleClose = () => setOpen(false);

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // You should create a SetupIntent on your backend and pass its client_secret here
    // For demo, I assume you have it as a prop or fetch it before this call
    // Replace with your actual client secret from backend

    const STRIPE_SECRET_KEY = 'dhdhdshsdh';
    const { setupIntent, error } = await stripe.confirmCardSetup(
      STRIPE_SECRET_KEY,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      console.error(error.message);
      alert(error.message);
      return;
    }

    // Pass the payment method id up to parent or save to backend here
    onCardAdded && onCardAdded(setupIntent.payment_method);

    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add Card Details"
      width="max-w-[600px]"
    >
      <div className="space-y-4">
        <div className="border p-4 rounded-md">
          <CardElement />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={handleClose}
            className="text-sm text-gray-600 hover:text-gray-800"
            type="button"
          >
            Cancel
          </button>

          <button
            onClick={handleAddCard}
            className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
            type="button"
            disabled={!stripe || !elements}
          >
            Add Card
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCardModal;
