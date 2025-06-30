import React from 'react';
import { Button } from '@/components/ui/button';

export default function ConfirmationBox({
  description = 'Are you sure you want to purchase this credit package?',
  onConfirm,
  onCancel,
}) {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold text-center mb-2">
        Confirm Purchase
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">{description}</p>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-gray-500 border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-teal-500 hover:bg-teal-600 text-white"
        >
          Yes, purchase
        </Button>
      </div>
    </div>
  );
}
