'use client';
import Cookies from 'js-cookie';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import countries from '@/data/countries';
import MainLayout from '@/components/main/common/layout';
import HeroHome from '@/components/main/home/HeroHome';
import HomeCategoryWiseServices from '@/components/main/home/HomeCategoryWiseServices';
import TestimonialSlider from '@/components/main/home/HomeTestimonials';

export default function page() {
  const [searchParam, setSearchParam] = useState('');
  const token = useSelector((state) => state.auth.token);
  //console.log('token', token);
  const currentUser = useSelector((state) => state.auth.user);
  console.log('currentUser', currentUser);

  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get('clientRegister');
    setSearchParam(value);

    if (currentUser !== null) {
      Cookies.remove('countryObj');

      // try to find match
      let selectedCountry = countries.find(
        (c) => c.slug === currentUser?.country?.toLowerCase()
      );

      // fallback to AU if not found
      if (!selectedCountry) {
        selectedCountry = countries.find((c) => c.slug === 'au');
      }

      Cookies.set('countryObj', JSON.stringify(selectedCountry), {
        expires: 3650,
        path: '/',
        sameSite: 'lax',
      });

      router.push(`/${selectedCountry.slug}`);
    } else {
      // check if cleanPath exists in country slugs
      const matchedCountry = countries.find(
        (c) => c.slug === params?.country?.toLowerCase()
      );

      if (matchedCountry) {
        Cookies.remove('countryObj');
        Cookies.set('countryObj', JSON.stringify(matchedCountry), {
          expires: 3650,
          path: '/',
          sameSite: 'lax',
        });
      } else {
        router.push('/');
      }
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
      <TestimonialSlider />
      {/* <TestimonialSliderTest /> */}
      {/* <HomeCTA /> */}
    </MainLayout>
  );
}
