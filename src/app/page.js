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
    let cookieCountry = Cookies.get('country');

    // fallback to Australia if not found
    if (!cookieCountry) {
      cookieCountry = 'AU'; // default
      Cookies.set('country', cookieCountry, { expires: 7 });
    }

    // find full country object from countries.json
    const selectedCountry =
      countries.find(
        (c) => c.code.toLowerCase() === cookieCountry.toLowerCase()
      ) || countries.find((c) => c.name === 'Australia'); // fallback

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
