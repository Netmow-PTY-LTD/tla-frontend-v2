

import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const LocationAccordionItem = ({ register, locationdata }) => {
  const formattedLocations =
    locationdata?.data?.map((item) => {
      const { _id, locationType, rangeInKm, traveltime, travelmode, locationGroupId, } = item;

      // Base value object containing coordinates
      const baseValue = {
        coord: locationGroupId?.location?.coordinates || [0, 0], // [longitude, latitude]
        locationType,
        id: _id,
      };

      if (locationType === 'nation_wide') {
        return {
          id: _id,
          label: 'Nationwide',
          value: JSON.stringify({ ...baseValue, label: 'Nationwide' }),
        };
      }

      if (locationType === 'distance_wise') {
        return {
          id: _id,
          label: `Within ${rangeInKm} km of ${locationGroupId?.zipcode || 'Selected area'}`,
          value: JSON.stringify({ ...baseValue, rangeInKm, label: `Within ${rangeInKm} km` }),
        };
      }

      if (locationType === 'travel_time') {
        return {
          id: _id,
          label: `Within ${traveltime} min ${travelmode} of ${locationGroupId?.zipcode || 'Selected area'}`,
          value: JSON.stringify({ ...baseValue, traveltime, travelmode, label: `Within ${traveltime} min` }),
        };
      }

      return {
        id: _id,
        label: locationGroupId?.zipcode || 'Unknown Location',
        value: JSON.stringify(baseValue),
      };
    }) || [];

console.log('locationData', locationdata);

  return (
    <AccordionItem value="item-7">
      <AccordionTrigger className="hover:no-underline">Locations</AccordionTrigger>
      <AccordionContent className="overflow-hidden">
        <div className="flex flex-col gap-4 text-balance">
          {formattedLocations.length > 0 ? (
            formattedLocations.map((loc) => (
              <label
                key={loc.id}
                htmlFor={loc.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  id={loc.id}
                  value={loc.value}
                  {...register('location')}
                />
                {loc.label}
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No locations available</p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default LocationAccordionItem;
