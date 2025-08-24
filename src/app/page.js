'use client';
import MainLayout from '@/components/main/common/layout';
import HeroHome from '@/components/main/home/HeroHome';
import HomeServices from '@/components/main/home/HomeServices';
import HomeFeatures from '@/components/main/home/HomeFeatures';
import HomeCTA from '@/components/main/home/HomeCTA';
import HomeAboutPreview from '@/components/main/home/HomeAboutPreview';
import TestimonialSlider from '@/components/main/home/HomeTestimonials';
import HomeCategoryWiseServices from '@/components/main/home/HomeCategoryWiseServices';
import { useEffect, useState } from 'react';
import TestimonialSliderTest from '@/components/main/home/HomeTestimonialsTest copy';
import Cookies from 'js-cookie';
import countries from '@/data/countries';

export default function Home() {
  const [searchParam, setSearchParam] = useState('');
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get('clientRegister');

    setSearchParam(value);

    // Try to get full country object from cookie
    let cookieCountryObj = Cookies.get('countryObj');
    let selectedCountry;

    if (cookieCountryObj) {
      try {
        selectedCountry = JSON.parse(cookieCountryObj);
      } catch (e) {
        console.error('Invalid country cookie, falling back to code');
      }
    }

    // If no full object in cookie, fallback to basic code or default
    if (!selectedCountry) {
      let cookieCountryCode = Cookies.get('country');

      if (!cookieCountryCode) {
        cookieCountryCode = 'au'; // default
        Cookies.set('country', cookieCountryCode, { expires: 3650 });
      }

      selectedCountry =
        countries.find(
          (c) => c.code.toLowerCase() === cookieCountryCode.toLowerCase()
        ) || countries.find((c) => c.name === 'Australia'); // fallback

      // Save full country object in cookie (stringified)
      Cookies.set('countryObj', JSON.stringify(selectedCountry), {
        expires: 3650,
      });
    }

    setCountry(selectedCountry);
  }, []);

  return (
    <MainLayout>
      <HeroHome searchParam={searchParam} cookieCountry={country} />
      {/* <HomeAboutPreview /> */}
      {/* <HomeServices /> */}
      <HomeCategoryWiseServices />
      {/* <HomeFeatures /> */}
      {/* <HomeTestimonials /> */}
      <TestimonialSlider />
      {/* <TestimonialSliderTest /> */}
      {/* <HomeCTA /> */}
    </MainLayout>
  );
}
