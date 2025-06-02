'use client';

import { useFormContext } from 'react-hook-form';

export default function AboutFormActions() {
  const { reset } = useFormContext();

  const onCancel = () => {
    reset();
    console.log('🔄 Form reset to initial values');
  };

  return (
    <div className="flex justify-between items-center pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="text-sm text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
      >
        Save
      </button>
    </div>
  );
}
