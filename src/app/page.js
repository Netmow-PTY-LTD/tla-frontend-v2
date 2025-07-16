import MainLayout from '@/components/main/common/layout';
import HeroHome from '@/components/main/home/HeroHome';
import HomeServices from '@/components/main/home/HomeServices';
import HomeFeatures from '@/components/main/home/HomeFeatures';
import HomeCTA from '@/components/main/home/HomeCTA';
import HomeAboutPreview from '@/components/main/home/HomeAboutPreview';
import TestimonialSlider from '@/components/main/home/HomeTestimonials';
import HomeCategoryWiseServices from '@/components/main/home/HomeCategoryWiseServices';

export default function Home() {
  return (
    <MainLayout>
      <HeroHome />
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
