'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from '@react-google-maps/api';
import { useGetRangeListQuery } from '@/store/features/public/publicApiService';
import ZipCodeComboboxMap from './about/ZipCodeComboboxMap';
import ZipCodeCombobox from '@/components/UIComponents/ZipCodeCombobox';
import AddressCombobox from '@/app/client/_components/profile/AddressCombobox';
import FormWrapper from '@/components/form/FromWrapper';
import LocationCombobox from '../../skill-settings/_components/LocationCombobox';
const libraries = ['places']; // needed for autocomplete

const containerStyle = {
  width: '100%',
  height: '400px',
};

const milesToMeters = (miles) => miles * 1609.34;

export default function DistanceMap({
  distanceLocation,
  setDistanceLocation,
  radius,
  setRadius,
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { data: rangeData } = useGetRangeListQuery();

  //const [location, setLocation] = useState(countryName);
  // const [radius, setRadius] = useState(100); // miles
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [zoom, setZoom] = useState(6); // 👈 zoom state
  const [map, setMap] = useState(null); // store map instance
  const currentCircle = useRef(null); // Track current circle instance

  useEffect(() => {
    if (radius) {
      setRadius(radius);
    }
  }, [radius]);

  const location = distanceLocation?.zipcode;

  // console.log('distanceLocation in DistanceMap', distanceLocation);
  // console.log('location in DistanceMap', location);
  // Geocode on demand
  const geocodeLocation = useCallback(
    async (location, map) => {
      console.log('Geocoding location:', location);
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            location
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === 'OK') {
          const { lat, lng } = data.results[0].geometry.location;
          setCenter({ lat, lng });
          if (map) {
            map.panTo({ lat, lng });
          }
        } else {
          alert('Location not found');
        }
      } catch (err) {
        console.error(err);
      }
    },
    [location, map]
  );

  useEffect(() => {
    geocodeLocation(location, map);
  }, [location, map]);

  // 👇 Whenever zoom changes, update map directly
  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  // Function to clear existing circle and create new one
  const updateCircle = useCallback(() => {
    if (!map) return;

    // Remove existing circle if it exists
    if (currentCircle.current) {
      currentCircle.current.setMap(null);
      currentCircle.current = null;
    }

    // Create new circle
    const circle = new window.google.maps.Circle({
      strokeColor: '#4285F4',
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: '#4285F4',
      fillOpacity: 0.3,
      map: map,
      center: center,
      radius: milesToMeters(radius),
    });

    currentCircle.current = circle;
  }, [map, center, radius]);

  // Update circle when radius or center changes
  useEffect(() => {
    updateCircle();
  }, [updateCircle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentCircle.current) {
        currentCircle.current.setMap(null);
      }
    };
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-4">
      <div className="flex w-full">
        <div className="w-full md:w-2/3 md:pr-2">
          <label className="block text-sm font-medium mb-2">Location</label>
          {/* <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={geocodeLocation}
          className="mt-1 block w-full border rounded-lg px-3 py-2"
        /> */}
          <LocationCombobox
            location={distanceLocation}
            setLocation={setDistanceLocation}
          />
        </div>

        <div className="w-full md:w-1/3 md:pl-2 md:mt-0">
          <label className="block text-sm font-medium mb-2">Distance</label>
          <select
            value={radius}
            onChange={(e) => {
              setRadius(parseInt(e.target.value, 10));
            }}
            className="block w-full border rounded-lg px-3 py-2 h-[44px]"
          >
            {rangeData?.data?.map((m) => (
              <option key={m?._id} value={m?.value}>
                {m?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zoom selector */}
      {/* <div>
        <label className="block text-sm font-medium">Zoom</label>
        <select
          value={zoom}
          onChange={(e) => setZoom(parseInt(e.target.value, 10))}
          className="mt-1 block w-full border rounded-lg px-3 py-2"
        >
          {[5, 8, 10, 12, 14, 16].map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div> */}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={(mapInstance) => setMap(mapInstance)} // 👈 store instance
      >
        <Marker position={center} />
        {/* Circle is now managed manually via Google Maps API */}
      </GoogleMap>
    </div>
  );
}
