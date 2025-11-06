import Faq from '@/components/main/about/Faq';
import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HowItWorksForCustomerComponent() {
  return (
    <MainLayout>
      <section
        className="banner-section section relative z-1 flex items-center"
        style={{
          backgroundImage: 'url(/assets/img/page-hero-bg-client.webp)',
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
                <h2 className="section-title">
                  Get Legal Help in 3 Simple Steps
                </h2>
                <div className="page-heading-text mb-3">
                  Finding the right lawyer shouldn’t be complicated. With The
                  Law App, you can connect with experienced legal professionals
                  in just three easy steps.
                </div>
                <Link
                  href="/?clientRegister=true"
                  className="btn-default btn-secondary uppercase"
                >
                  Find A Lawyer
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
      <section className="steps section">
        <div className="container">
          <div className="flex flex-col gap gap-y-[100px]">
            <div className="flex flex-wrap justify-between items-center">
              <div className="w-full md:w-1/2 md:pr-5">
                <Image
                  src={'/assets/img/client-step0.webp'}
                  width={542}
                  height={488}
                  alt="step0"
                  className="object-contain"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-5">
                <div className="steps-content mt-5">
                  <h2 className="section-title text-[36px] text-[--color-black] mb-4">
                    Let Us Know What You Need
                  </h2>
                  <p className="text-base text-[var(--color-text)]">
                    No matter what legal service you're after, we’ll connect you
                    with the right professional for the job.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              <div className="w-full md:w-7/12 md:pr-5">
                <Image
                  src={'/assets/img/client-step1.webp'}
                  width={560}
                  height={390}
                  alt="step1"
                />
              </div>
              <div className="w-full md:w-5/12 flex flex-col justify-center md:pl-5">
                <div className="steps-content mt-10">
                  <h2 className="section-title text-[36px] text-[--color-black] mb-4">
                    Choose Services
                  </h2>
                  <p className="text-base text-[var(--color-text)]">
                    Select the legal category that fits your needs, whether it’s
                    family law, real estate, business contracts, or any other
                    area of law.{' '}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center flex-row-reverse">
              <div className="w-full lg:w-1/2 lg:pl-5">
                <Image
                  src={'/assets/img/client-step2.webp'}
                  width={560}
                  height={390}
                  alt="step2"
                  className="w-full"
                />
              </div>
              <div className="w-full lg:w-5/12 flex flex-col justify-center lg:pr-5">
                <div className="steps-content">
                  <h2 className="section-title text-[36px] text-[--color-black] mb-4">
                    Provide Your Details
                  </h2>
                  <p className="text-base text-[var(--color-text)]">
                    Share a brief description of your legal issue or
                    requirements. The more details you provide, the better we
                    can match you with the right lawyer.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-7/12 lg:pr-5">
                <Image
                  src={'/assets/img/client-step3.webp'}
                  width={560}
                  height={390}
                  alt="step3"
                />
              </div>
              <div className="w-full lg:w-5/12 flex flex-col justify-center lg:pl-5">
                <div className="steps-content">
                  <h2 className="section-title text-[36px] text-[--color-black] mb-4">
                    Find the Best Match
                  </h2>
                  <p className="text-base text-[var(--color-text)]">
                    Receive multiple bids from verified lawyers, compare their
                    expertise, reviews, and pricing, and hire the one that best
                    fits your needs and budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Faq />
      <HomeCTA />
    </MainLayout>
  );
}
