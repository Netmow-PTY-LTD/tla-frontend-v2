import MainLayout from "@/components/main/common/layout";
import HeroHome from "@/components/main/home/HeroHome";
import HomeServices from "@/components/main/home/HomeServices";
export default function Home() {
  return (
    <MainLayout>
      <HeroHome />
      <HomeServices />
    </MainLayout>
  );
}
