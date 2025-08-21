import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import NewsletterSignup from '../../NewsletterSignup';
import FooterContact from './FooterContact';
import LinkedIn from '@/components/icon/LinkedIn';
import Facebook from '@/components/icon/Facebook';
import Twiiter from '@/components/icon/Twiiter';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useSelector } from 'react-redux';
import Twitter from '@/components/icon/Twiiter';
import ShowCountriesListModal from '../../home/modal/ShowCountriesListModal';
import Chevron from '@/components/icon/ChevronDown';
import Cookies from 'js-cookie';
import countries from '@/data/countries.json';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cookieCountry = Cookies.get('country');

  //console.log('cookieCountry', cookieCountry);

  const defaultCountry = cookieCountry
    ? countries.find((c) => c.code.toLowerCase() === cookieCountry)
    : null;

  //console.log('defaultCountry', defaultCountry);

  const [selectedCountry, setSelectedCountry] = useState(
    defaultCountry || null
  );

  // console.log('cookieCountry in footer', JSON.parse(cookieCountry));

  const token = useSelector((state) => state.auth.token);

  const { data: currentUser } = useAuthUserInfoQuery(undefined, {
    skip: !token,
  });

  // console.log('token', token);
  // console.log('currentUser', currentUser);

  const dashboardPaths = {
    admin: '/admin',
    lawyer: '/lawyer/dashboard',
    client: '/client/dashboard',
  };

  const dashboardUrl = dashboardPaths[currentUser?.data?.regUserType] || '';

  return (
    <>
      {/* <NewsletterSignup /> */}
      <footer
        className="main-footer"
        // style={{ backgroundImage: `url('/assets/img/footer_bg.png')` }}
      >
        <div className="footer-top mb-[60px]">
          <div className="container">
            <div className="footer-top-widgets flex flex-wrap justify-between">
              <div className="max-w-full w-full pr-0 lg:pl-5 mt-4 lg:mt-0">
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
                      {/* <li>
                        <Link href="https://www.youtube.com/" target="_blank">
                          Tutorials
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                  <div className="footer-widget w-[calc(50%-15px)] md:w-auto">
                    <h5>For Clients</h5>
                    <ul>
                      <li>
                        <Link
                          href={
                            token || currentUser
                              ? dashboardUrl
                              : '/?clientRegister=true'
                          }
                        >
                          Find Lawyers
                        </Link>
                      </li>
                      <li>
                        <Link href="/how-it-works/clients">How IT Works</Link>
                      </li>
                      <li>
                        <Link
                          href={token || currentUser ? dashboardUrl : '/login'}
                        >
                          Login Client
                        </Link>
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
                        <Link
                          href={
                            token || currentUser ? dashboardUrl : '/register'
                          }
                        >
                          Join as a Lawyer
                        </Link>
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
                  <div className="footer-widget w-[calc(50%-15px)] md:w-auto text-right">
                    <h5 style={{ marginBottom: '25px' }}>Need help ?</h5>
                    <Link href={'/contact'} className="btn-default btn-primary">
                      Contact Us
                    </Link>
                    <div className="footer-social-icon mt-4 flex item-center gap-3 justify-end">
                      <Link
                        href="https://x.com/TheLawAppOnline"
                        className="twitter"
                        target="_blank"
                      >
                        <Twitter width={20} height={20} />
                      </Link>
                      <Link
                        href="https://www.facebook.com/thelawapp"
                        className="fb"
                        target="_blank"
                      >
                        <Facebook width={22} height={22} />
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/the-law-app-22b048166/"
                        className="linkedin"
                        target="_blank"
                      >
                        <LinkedIn width={22} height={22} />
                      </Link>
                    </div>
                    <div className="footer-bottom-country-select mt-5">
                      <button
                        className="flex gap-3 items-center bg-[#F9F9FA] rounded-sm p-3"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModalOpen(true);
                        }}
                      >
                        <img
                          src={selectedCountry?.flag}
                          alt={`${selectedCountry?.name} flag`}
                          className="w-8 h-6 object-cover rounded-sm"
                        />
                        <span className="font-medium">
                          {selectedCountry?.name}
                        </span>
                        <Chevron />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <FooterContact /> */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-wrapper">
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
                    <div className="footer-bottom-menu">
                      <ul className="flex items-center gap-3">
                        <li>
                          <Link href="/">Disclaimer</Link>
                        </li>
                        <li>
                          <Link href="/">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link href="/">Terms & Use</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ShowCountriesListModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </>
  );
}
