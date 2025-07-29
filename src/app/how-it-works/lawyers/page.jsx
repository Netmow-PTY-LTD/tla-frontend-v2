import Faq from '@/components/main/about/Faq';
import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import SectionHeading from '@/components/main/home/SectionHeading';
import WorkingSteps from '@/components/main/WorkingSteps';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HowItWorksForLawyers() {
  const sectionHeading = {
    subtitle: 'Who We Are?',
    title: 'The Law App – Transforming Legal Connections',
    paragraph:
      'The Law App is a cutting-edge legal services marketplace designed to help clients and lawyers connect effortlessly. We provide a smart, user-friendly platform where clients can post their legal needs and receive competitive offers from qualified lawyers.',
  };
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
                <h2 className="section-title">The Law App for Professionals</h2>
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
      <section className="steps section">
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-7/12 lg:pr-5">
              <Image
                src={'/assets/img/step1.webp'}
                width={600}
                height={400}
                alt="step1"
                className="w-full"
              />
            </div>
            <div className="w-full lg:w-5/12 flex flex-col justify-center lg:pl-5">
              <div className="steps-content">
                <h2 className="section-title text-[36px] text-[--color-black] mb-4">
                  Choose Services
                </h2>
                <p className="text-base text-[var(--color-text)]">
                  Select the legal category that fits your needs, whether it’s
                  family law, real estate, business contracts, or any other area
                  of law.{' '}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center flex-row-reverse py-[100px]">
            <div className="w-full lg:w-7/12 lg:pl-5">
              <Image
                src={'/assets/img/step2.webp'}
                width={600}
                height={400}
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
                  Share a brief description of your legal issue or requirements.
                  The more details you provide, the better we can match you with
                  the right lawyer.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-7/12 lg:pr-5">
              <Image
                src={'/assets/img/step3.webp'}
                width={600}
                height={400}
                alt="step3"
                className="w-full"
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
          <div className="flex flex-wrap justify-center gap-4 mt-16">
            <Link href="/" className="btn-default btn-secondary">
              Join as Lawyer - find client
            </Link>
            <Link href="/register" className="btn-default btn-outline-primary">
              Join as Client - post cases
            </Link>
          </div>
        </div>
      </section>
      <Faq />
      <HomeCTA />
    </MainLayout>
  );
}
