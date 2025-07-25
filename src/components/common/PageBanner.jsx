import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function PageBanner({ title }) {
  return (
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
  );
}
