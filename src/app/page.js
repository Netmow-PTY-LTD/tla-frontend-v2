import MainLayout from "@/components/main/common/layout";
import HeroHome from "@/components/main/home/HeroHome";
import HomeServices from "@/components/main/home/HomeServices";
import HomeFeatures from "@/components/main/home/HomeFeatures";
import HomeTestimonials from "@/components/main/home/HomeTestimonials";
import HomeCTA from "@/components/main/home/HomeCTA";
export default function Home() {
  return (
    <MainLayout>
      <HeroHome />
      <HomeServices />
      <HomeFeatures />
      <HomeTestimonials />
      <HomeCTA />
    </MainLayout>
  );
}
