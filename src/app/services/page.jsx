'use client';
import LawCard from '@/components/main/common/card/LawCard';
import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import SectionHeading from '@/components/main/home/SectionHeading';
import WorkingSteps from '@/components/main/WorkingSteps';
import { useAllServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetAllCategoriesQuery } from '@/store/features/public/catagorywiseServiceApiService';
import Link from 'next/link';

const ServicesPage = () => {
  //const { data: allServices } = useAllServicesQuery();

  const { data: allCategories } = useGetAllCategoriesQuery();
  const allServices =
    allCategories?.data?.flatMap((category) => category.services) || [];

  //console.log('allServices', allServices);

  return (
    <MainLayout>
      <section
        className="banner-section section relative z-1 flex items-center"
        style={{
          backgroundImage: 'url(/assets/img/services-bg.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          minHeight: '60vh',
        }}
      >
        <div className="container">
          <div className="flex flex-wrap gap-10 items-center">
            <div className="w-full sm:w-1/2">
              <div className="page-heading lg:pr-20">
                <h2 className="section-title">
                  Professional Legal Services by The Law App
                </h2>
                <div className="page-heading-text mb-3">
                  The Law App connects you directly with experienced Australian
                  lawyers, anytime you need legal advice. Whether you're dealing
                  with family matters, property disputes, contracts, or wills -
                  post your case and receive guidance without the traditional
                  high costs or delays. Fast, secure, and client-focused.
                </div>
                <Link href="/register" className="btn-default btn-secondary">
                  Get Started
                </Link>
              </div>
            </div>
            {/* <div className="absolute right-0 top-0 h-full z-[-1]">
              <Image
                src={'/assets/img/page-hero-bg.webp'}
                width={600}
                height={400}
                alt="banner"
                className="w-full"
              />
            </div> */}
          </div>
        </div>
      </section>
      <section className="pt-12 mb-20">
        <div className="container">
          <SectionHeading
            title="Find From Wide Range of Legal Services"
            subtitle="Our Services"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5 lg:mt-8">
            {allServices?.length > 0 &&
              allServices?.map((service, index) => (
                <LawCard key={index} service={service} />
              ))}
          </div>
        </div>
      </section>
      <WorkingSteps />
      <HomeCTA />
    </MainLayout>
  );
};

export default ServicesPage;
