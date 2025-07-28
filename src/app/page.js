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

export default function Home() {
  const [searchParam, setSearchParam] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const value = searchParams.get('clientRegister');

    setSearchParam(value);
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
      {/* <HomeCTA /> */}
    </MainLayout>
  );
}
