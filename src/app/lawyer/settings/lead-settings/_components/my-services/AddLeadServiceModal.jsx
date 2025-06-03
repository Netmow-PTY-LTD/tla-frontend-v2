'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/UIComponents/Modal';
import { X } from 'lucide-react';

import React, { useState } from 'react';

const suggestions = [
  'Man & Van Services',
  'Property Extensions',
  'Porch Installation',
  'Couriers',
  'House Clearance',
  'Limousine Hire',
  'Garage Conversions',
  'Parcel Delivery',
  'Airport Transfers',
  'Kitchen Refurbishment',
];

const AddLeadServiceModal = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  const addService = (service) => {
    if (!selectedServices.includes(service)) {
      setSelectedServices((prev) => [...prev, service]);
      setInputValue('');
    }
  };

  const removeService = (service) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service));
  };

  const filteredSuggestions = suggestions?.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedServices.includes(s)
  );

  return (
    <div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add service"
        description="Type the name of your service to start searching our thousands of available services."
        buttonName="+ Add a service"
        className="w-full " // ensure modal is full width (adjust max-width as needed)
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
                  key={service}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => addService(service)}
                >
                  {service}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Services */}
        {selectedServices.length > 0 && (
          <div>
            <p className="text-sm font-medium mt-4 mb-2">
              New services you're adding
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((service) => (
                <Badge
                  key={service}
                  className="bg-black text-white px-2 py-1 flex items-center"
                >
                  {service}
                  <X
                    className="ml-2 h-3 w-3 cursor-pointer"
                    onClick={() => removeService(service)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div>
          <p className="text-sm font-medium mt-4 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((service) => (
              <Button
                key={service}
                variant="outline"
                size="sm"
                onClick={() => addService(service)}
              >
                + {service}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex justify-between">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-teal-500 hover:bg-teal-600">
            Add Services
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddLeadServiceModal;
