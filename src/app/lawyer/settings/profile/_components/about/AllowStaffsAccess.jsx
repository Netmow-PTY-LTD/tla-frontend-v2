import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function AllowStaffsAccess() {
  const { register, watch } = useFormContext();

  //const isAccessibleByOtherUsers = watch('isAccessibleByOtherUsers');

  const handleToggle = (e) => {
    // Handle the toggle logic here
    // console.log('Checkbox toggled:', e.target.checked);
  };
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 flex items-start gap-3 mt-10">
      <input
        type="checkbox"
        id="isAccessibleByOtherUsers"
        //checked={isAccessibleByOtherUsers}
        {...register('isAccessibleByOtherUsers')}
        className="mt-1 h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
      />
      <label
        htmlFor="isAccessibleByOtherUsers"
        className="text-gray-700 text-sm sm:text-base leading-snug cursor-pointer select-none"
      >
        Allow company staff to access your dashboard securely.
      </label>
    </div>
  );
}
