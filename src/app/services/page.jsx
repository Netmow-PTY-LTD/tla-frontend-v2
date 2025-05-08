'use client';
import LawCard from '@/components/main/common/card/LawCard';
import MainLayout from '@/components/main/common/layout';
import SectionHeading from '@/components/main/home/SectionHeading';
import WorkingSteps from '@/components/main/WorkingSteps';
import { useGetAllServicesQuery } from '@/store/api/public/publicApiService';

const ServicesPage = () => {
  const { data: allServices } = useGetAllServicesQuery();
  return (
    <MainLayout>
      <section className="bg-[url('/assets/img/services/service-bg.png')]  pt-12 mb-20 ">
        <div className="container">
          <SectionHeading
            title="Find From Wide Range of Legal Services"
            subtitle="Our Services"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5 lg:mt-8">
            {allServices?.data?.length > 0 &&
              allServices?.data?.map((service) => (
                <LawCard key={service._id} service={service} />
              ))}
          </div>
        </div>
      </section>
      <WorkingSteps />
    </MainLayout>
  );
};

export default ServicesPage;
