import Link from 'next/link';
import React from 'react';
export default function HomeCTA() {
  return (
    <>
      <section className="home-cta section">
        <div className="container">
          <div className="home-cta-content">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 lg:w-5/12">
                <div className="home-cta-text md:pr-5 lg:pr-20">
                  <h2 className="section-title">
                    Find From Wide Range of Legal Services
                  </h2>
                  <div className="cta-text">
                    From family law and property disputes to business contracts
                    and criminal defense, The Law App connects you with
                    qualified lawyers across various legal fields. Post your
                    case, compare bids, and choose the right lawyer—all in one
                    place.
                  </div>
                  <div className="home-cta-button flex flex-wrap gap-2">
                    <Link href="/register" className="btn-default btn-primary">
                      Join as Client
                    </Link>
                    <Link
                      href="/register"
                      className="btn-default btn-outline-black"
                    >
                      Join as Lawyer
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-7/12">
                <div className="home-cta-images">
                  <div className="cta-shape"></div>
                  <img
                    src="/assets/img/cta-list.png"
                    alt="CTA list"
                    className="cta-img-1"
                  />
                  <img
                    src="/assets/img/home-cta.png"
                    alt="home cta"
                    className="cta-img-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
