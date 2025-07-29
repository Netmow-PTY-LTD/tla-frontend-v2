import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function PageBanner({ title }) {
  return (
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
              <h2 className="section-title">{title}</h2>
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
  );
}

{
  /*
   <section className="pricing-banner pt-[50px]">
      <div className="container">
        <div className="pricing-banner-content flex flex-wrap bg-[var(--color-text)] rounded-[30px] overflow-hidden">
          <div className="p-[20px] md:p-[50px] w-full md:w-[calc(100%-356px)] flex flex-col justify-center items-start gap-[30px]">
            <h1 className="text-white">{title}</h1>
            <p className="text-white">
              From the moment you sign up, we’ll start sending you leads —
              completely free. You only pay when you choose to contact the
              customers that are right for your business.
            </p>

            <Link href="/register" className="btn-default btn-primary">
              Join as a Lawyer
            </Link>
          </div>
          <div className="w-full md:max-w-[356px] hidden md:block">
            <Image
              src="/assets/img/circle.png"
              width={356}
              height={353}
              alt="banner shape"
            />
          </div>
        </div>
      </div>
    </section>
  
  */
}
