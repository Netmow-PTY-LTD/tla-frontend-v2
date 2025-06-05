'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Checkbox } from '@/components/ui/checkbox';
import { useDeleteLeadServiceMutation } from '@/store/features/leadService/leadServiceApiService';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';

const LeadServiceAction = ({
  leadServiceId,
  onSubmit,
  isDirty,
  serviceLocations,
}) => {
  const [deleteService] = useDeleteLeadServiceMutation();
  const [locations, setLocations] = useState(serviceLocations);
  const [selectedLocations, setSelectedLocations] = useState(locations);

  const handleAddLocation = () => {
    const newLocation = prompt('Enter new location');
    if (newLocation && !locations?.includes(newLocation)) {
      setLocations((prev) => [...prev, newLocation]);
      setSelectedLocations((prev) => [...prev, newLocation]);
    }
  };

  const handleToggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleDeleteService = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this service?'
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteService(leadServiceId).unwrap();

      if (response.success) {
        showSuccessToast(response?.message || 'Service removed successfully');
      } else {
        showErrorToast('Failed to remove service');
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage =
        error?.data?.message || 'An error occurred while removing the service';
      showErrorToast(errorMessage);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Location</h2>
        {/* <button
          className="text-sm text-blue-600 hover:underline"
          onClick={handleAddLocation} // implement this to show a prompt/modal/input
        >
          + Add Location
        </button> */}
      </div>

      <div className="space-y-2">
        {locations.length > 0 ? (
          locations.map((location, index) => (
            <label
              key={index}
              className="flex items-center justify-between px-8 py-2  rounded-md  hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => handleToggleLocation(location)}
                  id={`location-${index}`}
                />
                <span className="text-sm text-gray-800">{location}</span>
              </div>
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No locations added yet.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleDeleteService}
          className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          <Trash className="w-5 h-5 mr-2" />
          <span>Remove this Service</span>
        </button>
        <button
          disabled={!isDirty}
          className={`px-4 py-3 text-sm rounded-lg text-white mt-5
            ${
              isDirty
                ? 'bg-[#12C7C4CC] hover:bg-teal-300'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
          onClick={onSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LeadServiceAction;
