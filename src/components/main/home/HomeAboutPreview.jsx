import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HomeAboutPreview() {
  return (
    <section className="home-about-preview section">
      <div className="container">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 lg:pr-10">
            <div className="feature-heading">
              <h3 className="section-subtitle">
                Looking for legal help from a lawyer?
              </h3>
              <h2 className="section-title">Legal Help Made Simple with TLA</h2>
              <div className="feature-heading-text">
                Finding or offering legal services is fast and hassle-free on
                The Law App. Just three easy steps:
                <ul>
                  <li>
                    <b>Post Your Case</b> – Share your legal issue, and let
                    qualified lawyers come to you. It takes just a few minutes.
                  </li>
                  <li>
                    <b>Get Bids from Lawyers</b> – Verified lawyers will review
                    your case and submit competitive offers tailored to your
                    needs.
                  </li>
                  <li>
                    <b>Choose the Best Lawyer</b> – Compare expertise, pricing,
                    and client reviews to hire the right legal professional with
                    confidence.
                  </li>
                </ul>
              </div>
              <Link href="/register" className="btn-default btn-primary">
                Join as Lawyer - Post your job
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 lg:pl-10">
            <div className="section-image mt-10 lg:mt-0">
              <Image
                src={'/assets/img/home-feature-1.png'}
                width={735}
                height={501}
                alt="feature"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
