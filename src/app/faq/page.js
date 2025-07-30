import MainLayout from '@/components/main/common/layout';
import React from 'react';
import Faqs from './_components/Faqs';
import SectionHeading from '@/components/main/home/SectionHeading';
import { clientsfaqsData, lawyerfaqsData } from '@/data/data';
import HomeCTA from '@/components/main/home/HomeCTA';
import Link from 'next/link';
import PageBanner from '@/components/common/PageBanner';

export default function page() {
  return (
    <MainLayout>
      <PageBanner
        title="Frequently Asked Questions"
        subtitle={'Legal Help Made Clear'}
        bgImage={'/assets/img/faq-bg.webp'}
        paragraph={`Got questions about legal services, posting a case, or connecting with lawyers? Our FAQ section provides clear answers to help clients and legal professionals navigate the platform with confidence and ease.`}
      />
      <div className="mt-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="We've got answers!"
          className="mb-10"
        />

        <section className="my-16">
          <h3 className="text-2xl font-semibold  border-b border-gray-300 pb-3">
            For Clients
          </h3>
          <Faqs data={clientsfaqsData} />
        </section>

        <section>
          <h3 className="text-2xl font-semibold  border-b border-gray-300 pb-3">
            For Lawyers
          </h3>
          <Faqs data={lawyerfaqsData} />
        </section>
      </div>
      <HomeCTA />
    </MainLayout>
  );
}
