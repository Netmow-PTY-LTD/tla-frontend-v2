'use client';

import Cookies from 'js-cookie';
import { useEffect } from 'react';

export function useSetCountryFromIP() {
  useEffect(() => {
    const cookieCountry = Cookies.get('countryObj');
    if (cookieCountry) return; // ✅ already set (either by IP or user selection)

    async function detectCountry() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        // Example: adapt to your countries list
        const country = {
          code: data.country_code,
          name: data.country_name,
          slug: data.country_name.toLowerCase().replace(/\s+/g, '-'),
        };

        // ✅ Set cookie so rest of app can use it
        Cookies.set('countryObj', JSON.stringify(country), {
          expires: 3650,
          path: '/',
        });

      } catch (err) {
        console.error('Failed to detect country from IP:', err);
      }
    }

    detectCountry();
  }, []);
}
