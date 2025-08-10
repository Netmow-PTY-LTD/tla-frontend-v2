'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { useDeleteLeadServiceMutation } from '@/store/features/leadService/leadServiceApiService';
import { Trash, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';

const LeadServiceAction = ({
  leadServiceId,
  onSubmit,
  isDirty,
  serviceLocations = [],
  setServiceLocations = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteService] = useDeleteLeadServiceMutation();
  const [isLocationDirty, setIsLocationDirty] = useState(false); // ✅ NEW
  // Store original serviceLocations for comparison
  const originalLocationsRef = useRef(JSON.stringify(serviceLocations));

  // const handleAddLocation = () => {
  //   const newLocation = prompt('Enter new location');
  //   if (newLocation && !locations?.includes(newLocation)) {
  //     setLocations((prev) => [...prev, newLocation]);
  //     setSelectedLocations((prev) => [...prev, newLocation]);
  //   }
  // };

  const handleToggleLocation = (locationId) => {
    setServiceLocations((prev) => {
      const updated = prev.map((location) => {
        if (location._id !== locationId) return location;

        const alreadyChecked = location.serviceIds?.includes(leadServiceId);

        const updatedServiceIds = alreadyChecked
          ? location.serviceIds.filter((id) => id !== leadServiceId)
          : [...location.serviceIds, leadServiceId];

        return {
          ...location,
          serviceIds: updatedServiceIds,
        };
      });

      // ✅ Compare new vs original to set isLocationDirty
      const isChanged =
        JSON.stringify(updated) !== originalLocationsRef.current;
      setIsLocationDirty(isChanged);

      return updated;
    });
  };

  const handleDeleteService = async () => {
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
    } finally {
      setIsOpen(false); // Close the modal after operation
    }
  };

  const handleSave = () => {
    onSubmit();
    // ✅ Reset dirty state after saving
    originalLocationsRef.current = JSON.stringify(serviceLocations);
    setIsLocationDirty(false);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Location</h2>
        {/* Add Location button (to implement later) */}
        {/* <button
          className="text-sm text-blue-600 hover:underline"
          onClick={handleAddLocation}
        >
          + Add Location
        </button> */}
      </div>

      <div className="space-y-2">
        {serviceLocations?.length > 0 ? (
          serviceLocations?.map((location, index) => {
            const isChecked = location.serviceIds?.includes(leadServiceId);

            return (
              <label
                key={location._id}
                className="flex items-center justify-between px-8 py-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleToggleLocation(location._id)}
                    id={`location-${index}`}
                  />
                  <span className="text-sm text-gray-800">
                    {location?.locationGroupId?.zipcode}
                  </span>
                </div>
              </label>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 italic">
            No locations added yet.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <ConfirmationModal
          onConfirm={handleDeleteService}
          open={isOpen}
          onOpenChange={setIsOpen}
          description="You want to delete your case service?"
          trigger={
            <button
              type="button"
              className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <Trash className="w-5 h-5 mr-2" />
              <span>Remove this Service</span>
            </button>
          }
        />

        <button
          disabled={!isDirty && !isLocationDirty}
          className={`px-4 py-3 text-sm rounded-lg text-white mt-5 ${
            isDirty
              ? 'bg-[#12C7C4CC] hover:bg-teal-300'
              : isLocationDirty
              ? 'bg-[#12C7C4CC] hover:bg-teal-300'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LeadServiceAction;
