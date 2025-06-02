'use client';

import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export default function AboutFormActions({ initialValues }) {
  const { reset, control } = useFormContext();

  const watched = useWatch({ control });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(watched) !== JSON.stringify(initialValues);
    setIsDirty(hasChanged);
  }, [watched, initialValues]);

  const onCancel = () => {
    reset(initialValues); // Reset to original values
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
        disabled={!isDirty}
        className={`px-4 py-2 text-sm rounded-md text-white ${
          isDirty
            ? 'bg-[#12C7C4] hover:bg-[#10b0ae]'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Save
      </button>
    </div>
  );
}
