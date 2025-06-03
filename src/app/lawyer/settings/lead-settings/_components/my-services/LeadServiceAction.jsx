'use client';

import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react';

const LeadServiceAction = () => {
  const [locations, setLocations] = useState(['New York', 'Los Angeles']);
  const [selectedLocations, setSelectedLocations] = useState(locations);

  const handleAddLocation = () => {
    const newLocation = prompt('Enter new location');
    if (newLocation && !locations.includes(newLocation)) {
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

  const handleSaveLocations = () => {
    console.log('Selected locations:', selectedLocations);
    // Save to backend or state
  };
  const handleDeleteService = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this service?'
    );
    if (confirmDelete) {
      console.log('Service removed');
      // Implement service removal logic here
    }
  };

  return (
    <div className=" p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Location</h2>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={handleAddLocation} // implement this to show a prompt/modal/input
        >
          + Add Location
        </button>
      </div>

      <div className="space-y-2">
        {locations.length > 0 ? (
          locations.map((location, index) => (
            <label
              key={index}
              className="flex items-center justify-between px-4 py-2  rounded-md  hover:bg-gray-50"
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
          className="btn-primary text-red-600 font-medium"
          onClick={() => handleDeleteService()} // implement this to remove the service
        >
          Remove this Service
        </button>
        <button
          className="bg-[#12C7C4CC] hover:bg-teal-300 px-4 py-3 text-sm rounded-lg text-white mt-5 "
          onClick={handleSaveLocations}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LeadServiceAction;
