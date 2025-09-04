'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import countries from '@/data/countries';

export default function CookieGlobalInit() {
  useEffect(() => {
    // Check if cookie exists
    const cookieCountryObj = Cookies.get('countryObj');
    if (!cookieCountryObj) {
      const defaultCountry =
        countries.find((c) => c.name === 'Australia') || countries[0];
      Cookies.set('countryObj', JSON.stringify(defaultCountry), {
        expires: 3650, // 10 years
        path: '/',
        sameSite: 'lax',
      });
    }
  }, []);

  return null; // invisible component
}
