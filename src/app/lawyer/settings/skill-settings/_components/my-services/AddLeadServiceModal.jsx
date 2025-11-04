'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/UIComponents/Modal';
import { useAllServicesQuery } from '@/store/features/admin/servicesApiService';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useAddLeadServiceMutation } from '@/store/features/leadService/leadServiceApiService';
import { Loader, X } from 'lucide-react';
import React, { useState } from 'react';

const AddLeadServiceModal = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [addLedService, { isLoading, isSuccess }] = useAddLeadServiceMutation();
  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    isError: isErrorUserInfo,
    error: errorUserInfo,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });


  const servicesUserIds = userInfo?.data?.profile?.serviceIds || [];


  const { data } = useAllServicesQuery();

  const allServices = data?.data ?? [];

  // 3. Filter out services that the user already has
  const suggestions = allServices.filter(
    (service) => !servicesUserIds?.some((userService) => userService._id === service._id)
  );





  const addService = (service) => {
    if (!selectedServices.find((s) => s._id === service._id)) {
      setSelectedServices((prev) => [...prev, service]);
      setInputValue('');
    }
  };

  const removeService = (serviceId) => {
    setSelectedServices((prev) => prev.filter((s) => s._id !== serviceId));
  };

  const handleAddServices = async () => {
    try {
      const payload = {
        serviceIds: selectedServices.map((s) => s._id),
      };

      const response = await addLedService(payload).unwrap();

      if (response.success) {
        showSuccessToast(response.message || 'Services added successfully');

        setSelectedServices([]);
        setOpen(false);
        // Additional actions if needed
      }

      // Reset
      setSelectedServices([]);
      setOpen(false);
    } catch (error) {
      console.error('Failed to add services:', error);
      const errorMessage = error?.data?.err?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };




  const filteredSuggestions = suggestions?.filter((s) =>
    s.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedServices.some((selected) => selected._id === s._id) &&
    !servicesUserIds.some((ser) => ser._id === s._id)
  );






  return (
    <div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add service"
        description="Type the name of your service to start searching our thousands of available services."
        buttonName="+ Add a skill"
        className="w-full " // ensure modal is full width (adjust max-width as needed)
        width="max-w-[600px]"
      >
        {/* Search Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Service</label>
          <Input
            placeholder="Start typing to find services..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
              {filteredSuggestions.map((service) => (
                <div
                  key={service._id}
                  onClick={() => addService(service)}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  {service.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Services */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedServices.map((service) => (
            <Badge
              key={service._id}
              className="bg-black text-white px-2 py-1 flex items-center"
            >
              {service.name}
              <X
                className="ml-2 h-3 w-3 cursor-pointer"
                onClick={() => removeService(service._id)}
              />
            </Badge>
          ))}
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-sm font-medium mt-4 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions?.filter((s) => !selectedServices.some((selected) => selected._id === s._id)).map((service) => (
              <Button
                key={service._id}
                variant="outline"
                size="sm"
                onClick={() => addService(service)}
              >
                + {service.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex justify-between">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handleAddServices}
            className="bg-teal-500 hover:bg-teal-600"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Add Services'
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddLeadServiceModal;
