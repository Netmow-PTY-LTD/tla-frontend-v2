'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useGetRangeListQuery } from '@/store/features/public/publicApiService';
import LocationCombobox from '../../skill-settings/_components/LocationCombobox';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';
import { Bus, Car, PersonStanding } from 'lucide-react';

const libraries = ['places'];
const containerStyle = { width: '100%', height: '400px' };
// Approximate conversion for display purposes - in reality this should use isochrone API
const minutesToMeters = (minutes, mode) => {
  // Rough estimation based on average speeds
  const speedKmh = {
    driving: 50, // 50 km/h average in urban areas
    walking: 5, // 5 km/h walking speed
    transit: 25, // 25 km/h average public transport
  };

  const speed = speedKmh[mode] || speedKmh.driving;
  const distanceKm = (speed * minutes) / 60;
  return distanceKm * 1000; // Convert to meters
};

export default function TravelTimeSelector() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { data: rangeData } = useGetRangeListQuery();
  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));
  const countryName = cookieCountry?.name || 'Australia';

  const [location, setLocation] = useState(countryName);
  const [radius, setRadius] = useState(15); // miles or minutes
  const [mode, setMode] = useState('driving'); // driving, walking, transit
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [zoom, setZoom] = useState(8);
  const [map, setMap] = useState(null);
  const currentCircle = useRef(null);

  // Geocode selected location
  const geocodeLocation = useCallback(async (location, map) => {
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
        if (map) map.panTo({ lat, lng });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    geocodeLocation(location, map);
  }, [location, map]);

  // Update circle each time radius/center/mode changes
  const updateCircle = useCallback(() => {
    if (!map) return;
    if (currentCircle.current) {
      currentCircle.current.setMap(null);
      currentCircle.current = null;
    }

    // Get color based on travel mode
    const modeColors = {
      driving: { stroke: '#4285F4', fill: '#4285F4' },
      walking: { stroke: '#34A853', fill: '#34A853' },
      transit: { stroke: '#EA4335', fill: '#EA4335' },
    };

    const colors = modeColors[mode] || modeColors.driving;

    const circle = new window.google.maps.Circle({
      strokeColor: colors.stroke,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: colors.fill,
      fillOpacity: 0.2,
      map: map,
      center: center,
      radius: minutesToMeters(radius, mode), // Convert minutes to approximate meters based on mode
    });

    currentCircle.current = circle;
  }, [map, center, radius, mode]);

  useEffect(() => {
    updateCircle();
  }, [updateCircle]);

  // Adjust zoom based on travel time and mode
  useEffect(() => {
    if (!map) return;

    // Calculate appropriate zoom level based on travel time
    const getZoomLevel = (minutes, mode) => {
      const radiusMeters = minutesToMeters(minutes, mode);
      // Zoom levels roughly based on circle radius
      if (radiusMeters < 2000) return 14; // < 2km
      if (radiusMeters < 5000) return 13; // < 5km
      if (radiusMeters < 10000) return 12; // < 10km
      if (radiusMeters < 20000) return 11; // < 20km
      return 10; // > 20km
    };

    const newZoom = getZoomLevel(radius, mode);
    map.setZoom(newZoom);
  }, [map, radius, mode]);

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
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Location</label>
          <LocationCombobox location={location} setLocation={setLocation} />
        </div>

        {/* Distance/Time */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Travel Time (minutes)
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value, 10))}
            className="block w-full border rounded-lg px-3 py-2 h-[44px]"
          >
            {[5, 10, 15, 20, 30, 45, 60].map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
        </div>

        {/* Travel Mode */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="block w-full border rounded-lg px-3 py-2 h-[44px]"
          >
            <option value="driving">Driving</option>
            <option value="walking">Walking</option>
            <option value="transit">Public Transport</option>
          </select>
        </div>
      </div>

      {/* Travel Mode Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          {/* <div className="w-3 h-3 rounded-full bg-blue-500"></div> */}
          <Car className="text-blue-500" />
          <span>Driving</span>
        </div>
        <div className="flex items-center gap-1">
          {/* <div className="w-3 h-3 rounded-full bg-green-500"></div> */}
          <PersonStanding className="text-green-500" />

          <span>Walking</span>
        </div>
        <div className="flex items-center gap-1">
          {/* <div className="w-3 h-3 rounded-full bg-red-500"></div> */}
          <Bus className="text-red-500" />
          <span>Public Transport</span>
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
        <p>
          <strong>Note:</strong> The circle shows an approximate area reachable
          within {radius} minutes by {mode}. Current mode:{' '}
          <span className="capitalize font-medium text-gray-700">{mode}</span>
        </p>
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker
          position={center}
          title={`${location} - ${radius} min by ${mode}`}
        />
      </GoogleMap>
    </div>
  );
}
