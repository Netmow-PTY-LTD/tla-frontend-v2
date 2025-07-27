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
                  <h2>Take the Next Step – Get Legal Help Today!</h2>
                  <div className="cta-text">
                    <ul>
                      <li>
                        <b className="text-[var(--color-black)] font-bold">
                          For Clients:{' '}
                        </b>
                        Need help with family law? Post your case and receive
                        free bids from top-rated lawyers!
                      </li>
                      <li>
                        <b className="text-[var(--color-black)] font-bold">
                          For Lawyers:{' '}
                        </b>
                        Looking for clients in family law? Join now and start
                        receiving cases instantly!
                      </li>
                    </ul>
                  </div>
                  <div className="home-cta-button flex gap-2">
                    <Link
                      href="/?clientRegister=true"
                      className="btn-default btn-secondary"
                    >
                      Join as Client
                    </Link>
                    <Link
                      href="/register"
                      className="btn-default btn-outline-primary"
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
