'use client';

import CheckboxInput from '@/components/form/CheckboxInput';
import SelectInput from '@/components/form/SelectInput';
import TextInput from '@/components/form/TextInput';
import { AlertCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function CompanyLocation() {
  const { watch, setValue } = useFormContext();

  const address = watch('location.address');
  const hideFromProfile = watch('location.hideFromProfile');
  const coordinates = watch('location.coordinates');

  console.log('cordinates', coordinates);

  const mapQuery = address?.trim() ? encodeURIComponent(address) : 'Australia';

  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!address) return;

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=YOUR_GOOGLE_MAPS_API_KEY` // Replace with your actual API key
        );
        const data = await res.json();

        if (data.status === 'OK') {
          const coords = data.results[0].geometry.location;
          setValue('location.coordinates.lat', coords.lat);
          setValue('location.coordinates.lng', coords.lng);
        }
      } catch (err) {
        console.error('Failed to fetch coordinates', err);
      }
    };

    fetchCoordinates();
  }, [address, setValue]);

  const options = [
    {
      label: 'No Location',
      value: 'no_location',
    },
    {
      label: 'Online only',
      value: 'online_only',
    },
    {
      label: 'Multiple Location',
      value: 'multiple_location',
    },
  ];

  return (
    <div className="py-9">
      <h2 className="text-black font-semibold">Company location</h2>
      <p className="mt-[10px] mb-7">
        Use a specific address to help customers searching for a local business.
      </p>

      <div className="flex justify-between gap-20">
        <div className="w-full">
          <TextInput
            label="What's the business location?"
            name="location.address"
            placeholder="Enter the company address"
          />

          <div className="flex items-center justify-start space-x-3 pt-4">
            <CheckboxInput
              label={"Don't show this on my profile"}
              name="location.hideFromProfile"
              id="hideFromProfile"
              className="mt-1 h-4 w-4 text-[#00C3C0] border-gray-300 rounded focus:ring-[#00C3C0]"
            />
            <AlertCircle className="w-4 h-4 text-gray-500 cursor-pointer" />
          </div>
          <div className="border-t border-white my-10" />
          <div>
            <SelectInput
              label={"Can't give us a particular location?"}
              name={'location.locationReason'}
              options={options}
              placeholder="Select a reason"
            />
          </div>
        </div>

        <div className="aspect-video w-full max-w-3xl border rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          />
        </div>
      </div>
    </div>
  );
}
