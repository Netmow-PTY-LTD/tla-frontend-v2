import MainLayout from '@/components/main/common/layout';
import React from 'react';
import Faqs from './_components/Faqs';
import SectionHeading from '@/components/main/home/SectionHeading';
import { clientsfaqsData, lawyerfaqsData } from '@/data/data';
import HomeCTA from '@/components/main/home/HomeCTA';
import Link from 'next/link';

export default function page() {
  return (
    <MainLayout>
      <section
        className="banner-section section relative z-1 flex items-center"
        style={{
          backgroundImage: 'url(/assets/img/page-hero-bg.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          minHeight: '75vh',
        }}
      >
        <div className="container">
          <div className="flex flex-wrap gap-10 items-center">
            <div className="w-full sm:w-2/3">
              <div className="page-heading lg:pr-20">
                <h3 className="section-subtitle">How It Works?</h3>
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="page-heading-text mb-3">
                  Grow your practice, reduce overheads, and connect with more
                  clients. The Law App gives you the tools to work smarter and
                  build your brand.
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
