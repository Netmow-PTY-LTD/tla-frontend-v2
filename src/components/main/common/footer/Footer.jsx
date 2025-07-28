import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import NewsletterSignup from '../../NewsletterSignup';
import FooterContact from './FooterContact';
import LinkedIn from '@/components/icon/LinkedIn';
import Facebook from '@/components/icon/Facebook';
import Twiiter from '@/components/icon/Twiiter';

export default function Footer() {
  return (
    <>
      {/* <NewsletterSignup /> */}
      <footer
        className="main-footer"
        // style={{ backgroundImage: `url('/assets/img/footer_bg.png')` }}
      >
        <div className="footer-top">
          <div className="container">
            <div className="footer-top-widgets flex flex-wrap justify-between">
              <div className="max-w-full lg:max-w-[380px] pr-0 lg:pr-5">
                <div className="footer-info">
                  {/* <Link href="/">
                    <Image
                      src={'/assets/img/logo.png'}
                      alt="TLA Logo"
                      width={220}
                      height={50}
                    />
                  </Link> */}
                  <div className="footer-text flex items-start">
                    <div className="">
                      <img
                        src="/assets/img/favicon.png"
                        alt="favicon"
                        className="float-left"
                      />
                      {`he Law App is changing the way people find legal help and how
                  lawyers grow their practice. Whether you’re a client in need
                  of expert advice or a lawyer looking to expand your reach, TLA
                  makes the process seamless, transparent, and efficient.`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-full lg:max-w-[calc(100%-480px)] w-full pr-0 lg:pl-5 mt-4 lg:mt-0">
                <div className="flex flex-wrap justify-between gap-[30px] md:gap-10">
                  <div className="footer-widget w-[calc(50%-15px)] md:w-auto">
                    <h5>Navigate</h5>
                    <ul>
                      <li>
                        <Link href="/about">About TheLawApp</Link>
                      </li>
                      <li>
                        <Link href="/contact">Contact</Link>
                      </li>
                      <li>
                        <Link
                          href="https://press.thelawapp.com.au/"
                          target="_blank"
                        >
                          Press
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-widget w-[calc(50%-15px)] md:w-auto">
                    <h5>For Clients</h5>
                    <ul>
                      <li>
                        <Link href="/?clientRegister=true">Find Lawyers</Link>
                      </li>
                      <li>
                        <Link href="/how-it-works/clients">How IT Works</Link>
                      </li>
                      <li>
                        <Link href="/login">Login Client</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-widget w-[calc(50%-15px)] md:w-auto">
                    <h5>For Lawyers</h5>
                    <ul>
                      <li>
                        <Link href="/how-it-works/lawyers">How It Works</Link>
                      </li>
                      <li>
                        <Link href="/register">Join as a Lawyer</Link>
                      </li>
                      <li>
                        <Link href="/pricing">Pricing</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-widget w-[calc(50%-15px)] md:w-auto">
                    <h5>Other Pages</h5>
                    <ul>
                      <li>
                        <Link href="/faq">FAQs</Link>
                      </li>
                      <li>
                        <Link href="/disclaimer">Disclaimer</Link>
                      </li>
                      <li>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link href="/terms">Terms of Use</Link>
                      </li>
                      <li>
                        <Link href="/trust-and-quality">Trust and Quality</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterContact />
        <div className="footer-bottom">
          <div className="container">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="footer-copyright text-center">
                <p>
                  Copyright &copy; {new Date().getFullYear()}{' '}
                  <Link href="/" className="text-[var(--primary-color)]">
                    The Law App.
                  </Link>
                </p>
              </div>
              <div className="footer-social flex lg:justify-end">
                <div className="flex items-center gap-4">
                  <b className="inline-block relative pr-[70px] after:absolute after:top-[12px] after:left-[85px] after:w-[64px] after:h-[2px] after:bg-[#0B1C2D]">
                    Follow Us{' '}
                  </b>
                  <Link href="#" className="linkedin">
                    <LinkedIn />
                  </Link>
                  <Link href="#" className="fb">
                    <Facebook />
                  </Link>
                  <Link href="#" className="twitter">
                    <Twiiter />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
