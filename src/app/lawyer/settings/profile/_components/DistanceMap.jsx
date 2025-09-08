'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from '@react-google-maps/api';
import { useGetRangeListQuery } from '@/store/features/public/publicApiService';

const libraries = ['places']; // needed for autocomplete

const containerStyle = {
  width: '100%',
  height: '400px',
};

const milesToMeters = (miles) => miles * 1609.34;

export default function DistanceMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { data: rangeData } = useGetRangeListQuery();

  console.log('rangeData', rangeData);

  const [location, setLocation] = useState('New York, NY');
  const [radius, setRadius] = useState(100); // miles
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [zoom, setZoom] = useState(6); // 👈 zoom state
  const [map, setMap] = useState(null); // store map instance

  // Geocode on demand
  const geocodeLocation = useCallback(async () => {
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
  }, [location, map]);

  useEffect(() => {
    geocodeLocation();
  }, []);

  // 👇 Whenever zoom changes, update map directly
  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium">Postcode / City</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={geocodeLocation}
          className="mt-1 block w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Distance</label>
        <select
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
          className="mt-1 block w-full border rounded-lg px-3 py-2"
        >
          {rangeData?.data?.map((m) => (
            <option key={m?._id} value={m?.value}>
              {m?.name}
            </option>
          ))}
        </select>
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
        <Circle
          key={radius} // 👈 reset whenever miles (radius) changes
          center={center}
          radius={milesToMeters(radius)}
          options={{
            fillColor: '#4285F4',
            fillOpacity: 0.3,
            strokeColor: '#4285F4',
            strokeOpacity: 0.7,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </div>
  );
}
