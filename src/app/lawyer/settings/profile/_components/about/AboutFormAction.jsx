'use client';

import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export default function AboutFormActions({ initialValues, isLoading }) {
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
        disabled={!isDirty || isLoading}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white text-sm transition-all duration-150 ${
          isDirty && !isLoading
            ? 'bg-[#12C7C4] hover:bg-[#10b0ae]'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>Save</span>
        )}
      </button>
    </div>
  );
}
