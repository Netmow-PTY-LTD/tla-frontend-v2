'use client';

import CheckboxInput from '@/components/form/CheckboxInput';
import SelectInput from '@/components/form/SelectInput';
import TextInput from '@/components/form/TextInput';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';
import { AlertCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { set } from 'zod';

export default function CompanyLocation({
  setZipCode,
  setLatitude,
  setLongitude,
  setPostalCode,
}) {
  const { watch, setValue } = useFormContext();

  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));

  const address = watch('location.address');
  console.log('address', address);
  const hideFromProfile = watch('location.hideFromProfile');
  const coordinates = watch('location.coordinates');

  const mapQuery = address?.trim()
    ? encodeURIComponent(address)
    : cookieCountry?.name;

  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  useEffect(() => {
    let autocomplete;

    const initAutocomplete = () => {
      const input = document.getElementById('address-input');
      if (!input) return;

      autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ['geometry', 'formatted_address', 'address_components'],
      });

      // ✅ Restrict search to Australia
      autocomplete.setComponentRestrictions({
        country: [cookieCountry?.code?.toLowerCase()],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        // Extract ZIP code
        const postalCodeObj = place.address_components.find((c) =>
          c.types.includes('postal_code')
        );
        const zipCode = postalCodeObj ? postalCodeObj.long_name : '';
        setPostalCode(zipCode);

        if (!zipCode) {
          // alert('Please select an address with a postal code.');
          return;
        }

        setZipCode(place.formatted_address);

        setValue('location.address', place.formatted_address);
        setValue('location.coordinates.lat', place.geometry.location.lat());
        setValue('location.coordinates.lng', place.geometry.location.lng());
        //setValue('location.zipCode', zipCode);
        console.log('Zip code:', zipCode);
      });
    };

    // ✅ Wait until Google script is loaded
    if (typeof window !== 'undefined') {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
      } else {
        window.initMap = initAutocomplete; // fallback if loading script dynamically
      }
    }
  }, [setValue]);

  // Still keep geocode fetch in case address changes without using autocomplete
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!address) return;

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();

        console.log('data from geocode', data);

        if (data.status === 'OK') {
          const coords = data.results[0].geometry.location;
          setValue('location.coordinates.lat', coords.lat);
          setValue('location.coordinates.lng', coords.lng);

          setLatitude(coords.lat);
          setLongitude(coords.lng);

          // Extract ZIP code
          const postalCodeObj = data.results[0].address_components.find(
            (component) => component.types.includes('postal_code')
          );
          const zipCode = postalCodeObj ? postalCodeObj.long_name : '';

          setPostalCode(zipCode);

          // ✅ Prevent null in autocomplete
          setValue('location.zipCode', zipCode);
          setZipCode(data.results[0].formatted_address);
          console.log('Zip code:', zipCode);
        }
      } catch (err) {
        console.error('Failed to fetch coordinates', err);
      }
    };

    fetchCoordinates();
  }, [address, setValue]);

  //  console.log('coordinates', coordinates);

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
      <h3 className="text-black font-semibold heading-lg">Company location</h3>
      <p className="mt-[10px] text-[#8E8E8E] mb-7">
        Provide a specific business address to improve visibility for clients
        searching for legal services in your area. A clear and accurate location
        helps build trust and connects you with local clients more effectively.
      </p>

      <div className="flex flex-wrap lg:flex-nowrap justify-between gap-20">
        <div className="w-full">
          <TextInput
            label="What's the business location?"
            name="location.address"
            placeholder="Enter the company address"
            textColor="text-[#4b4949]"
            id="address-input"
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
              textColor="text-[#4b4949]"
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
