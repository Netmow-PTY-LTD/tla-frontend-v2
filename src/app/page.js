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
import Cookies from 'js-cookie';
import countries from '@/data/countries';
import { useRouter } from 'next/navigation';
import HomeCompanyCTA from '@/components/main/home/HomeCompanyCTA';

export default function Home() {
  const [searchParam, setSearchParam] = useState('');

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get('clientRegister');
    setSearchParam(value);

    let selectedCountry = null;

    try {
      const cookieValue = Cookies.get('countryObj');

      // Check if cookie exists and is not the string "undefined"
      if (cookieValue && cookieValue !== 'undefined') {
        const parsed = JSON.parse(cookieValue);

        // Check if it has a valid slug
        if (parsed?.slug) {
          selectedCountry = parsed;
        } else {
          //console.warn('countryObj cookie missing slug. Deleting cookie.');
          Cookies.remove('countryObj');
        }
      } else {
        //console.warn('countryObj cookie is undefined or not set. Cleaning up.');
        Cookies.remove('countryObj');
      }
    } catch (e) {
      // console.error(
      //   'Failed to parse countryObj cookie. Removing corrupted cookie.'
      // );
      Cookies.remove('countryObj');
    }

    // If still not found, fallback to default (AU)
    if (!selectedCountry) {
      selectedCountry = countries.find((c) => c.slug === 'au') || countries[0];

      // Set a clean cookie
      Cookies.set('countryObj', JSON.stringify(selectedCountry), {
        expires: 3650,
        path: '/',
        sameSite: 'lax',
      });
    }

    // Finally, redirect only if slug exists
    if (selectedCountry?.slug) {
      router.push(`/${selectedCountry.slug}`);
    } else {
      router.push('/au');
    }
  }, []);

  return (
    <MainLayout>
      <HeroHome searchParam={searchParam} />
      {/* <HomeAboutPreview /> */}
      {/* <HomeServices /> */}
      <HomeCategoryWiseServices />
      {/* <HomeFeatures /> */}
      {/* <HomeTestimonials /> */}
      <HomeCompanyCTA />
      <TestimonialSlider />
      {/* <TestimonialSliderTest /> */}
      {/* <HomeCTA /> */}
    </MainLayout>
  );
}
