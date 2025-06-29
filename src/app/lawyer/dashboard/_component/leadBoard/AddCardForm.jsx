'use client';

import React, { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { useSetupPaymentIntentMutation } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { showErrorToast } from '@/components/common/toasts';

const inputStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: 'Roboto, sans-serif',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  },
};

const AddCardForm = ({ onCardAdded, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [setupPaymentIntent] = useSetupPaymentIntentMutation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    setLoading(true);

    try {
      const paymentIntent = await setupPaymentIntent().unwrap();
      const { clientSecret } = paymentIntent?.data;

      const { setupIntent, error } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setError(error.message ?? 'Something went wrong');
        showErrorToast(error.message);
      } else {
        setError(null);
        onCardAdded && onCardAdded(setupIntent.payment_method);
      }
    } catch (err) {
      console.error(err);
      showErrorToast('Failed to set up card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAddCard();
      }}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Add card details
      </h2>

      <label className="text-sm text-gray-600 mb-1 block">Card number</label>
      <div className="border rounded-md p-2 mb-4">
        <CardNumberElement options={inputStyle} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-600 mb-1 block">
            Expiry date
          </label>
          <div className="border rounded-md p-2 mb-4">
            <CardExpiryElement options={inputStyle} />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-600 mb-1 block">CVC</label>
          <div className="border rounded-md p-2 mb-4">
            <CardCvcElement options={inputStyle} />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:underline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-[#12C7C4] text-white px-4 py-2 rounded hover:bg-[#10b0ae] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Add card details'}
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-4 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a6 6 0 00-6 6v4H3a1 1 0 000 2h14a1 1 0 000-2h-1V8a6 6 0 00-6-6z" />
          </svg>
          <span>Your payment is secure</span>
        </div>
        <div className="flex gap-1 items-center">
          <img
            src="https://img.icons8.com/color/24/000000/visa.png"
            alt="Visa"
          />
          <img
            src="https://img.icons8.com/color/24/000000/mastercard-logo.png"
            alt="Mastercard"
          />
          <img
            src="https://img.icons8.com/color/24/000000/amex.png"
            alt="Amex"
          />
        </div>
      </div>
    </form>
  );
};

export default AddCardForm;
