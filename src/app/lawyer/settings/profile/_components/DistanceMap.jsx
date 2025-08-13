'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from '@react-google-maps/api';

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

  const [location, setLocation] = useState('New York, NY');
  const [radius, setRadius] = useState(100); // miles
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });

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
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error(err);
    }
  }, [location]);

  useEffect(() => {
    geocodeLocation();
  }, []);

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
        <label className="block text-sm font-medium">Radius</label>
        <select
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
          className="mt-1 block w-full border rounded-lg px-3 py-2"
        >
          {[10, 25, 50, 100].map((m) => (
            <option key={m} value={m}>
              {m} miles
            </option>
          ))}
        </select>
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <Marker position={center} />
        <Circle
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
