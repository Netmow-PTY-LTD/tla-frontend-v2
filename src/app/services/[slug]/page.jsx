'use client';

import FamilyLawCard from '@/components/main/common/card/FamilyLawCard';
import ServiceDetailsCard from '@/components/main/common/card/ServiceDetailsCard';
import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import SectionHeading from '@/components/main/home/SectionHeading';
import WorkingSteps from '@/components/main/WorkingSteps';
import { useSingleServiceQuery } from '@/store/features/admin/servicesApiService';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const SingleServiceDetailsPage = () => {
  const params = useParams();
  const { slug } = params;

  const { data: singleService } = useSingleServiceQuery(slug);

  console.log('singleService', singleService);

  return (
    <MainLayout>
      <section className="mx-4 lg:mx-[212px] my-[58px]">
        <div>
          <ServiceDetailsCard />
        </div>

        <div className="mt-[132px] ">
          <SectionHeading
            title="Common Family Law Issues & Solutions"
            paragraph="Finding legal help has never been simpler. Whether you're looking
              for a lawyer or offering legal services, The Law App streamlines
              the process in just three steps:"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-[30px] mt-5 lg:mt-10">
            <FamilyLawCard />
            <FamilyLawCard />
            <FamilyLawCard />
            <FamilyLawCard />
          </div>
        </div>
      </section>
      <WorkingSteps />
      <HomeCTA />
    </MainLayout>
  );
};

export default SingleServiceDetailsPage;
