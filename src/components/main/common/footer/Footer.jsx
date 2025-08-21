import React from 'react';
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
import Chevron from '@/components/icon/Chevron';
import ShowCountriesListModal from '../../home/modal/ShowCountriesModal';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
                    <h5 style={{marginBottom:'25px'}}>Need help ?</h5>
                    <button className="btn-default btn-primary">Contact Us</button>
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
                      <button className='flex gap-3 items-center bg-[#F9F9FA] rounded-sm p-3' onClick={(e)=>{
                        e.preventDefault();
                        setIsModalOpen(true);
                      }}>
                        <svg width="31" height="23" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1941_9591)">
                          <path d="M0.867188 0.416992H30.8672V22.917H0.867188V0.416992Z" fill="#012169"/>
                          <path d="M4.38281 0.416992L15.8203 8.90137L27.2109 0.416992H30.8672V3.32324L19.6172 11.7139L30.8672 20.0576V22.917H27.1172L15.8672 14.5264L4.66406 22.917H0.867188V20.1045L12.0703 11.7607L0.867188 3.41699V0.416992H4.38281Z" fill="white"/>
                          <path d="M20.7422 13.5889L30.8672 21.042V22.917L18.1641 13.5889H20.7422ZM12.1172 14.5264L12.3984 16.167L3.39844 22.917H0.867188L12.1172 14.5264ZM30.8672 0.416992V0.557617L19.1953 9.37012L19.2891 7.30762L28.5234 0.416992H30.8672ZM0.867188 0.416992L12.0703 8.66699H9.25781L0.867188 2.38574V0.416992Z" fill="#C8102E"/>
                          <path d="M12.1641 0.416992V22.917H19.6641V0.416992H12.1641ZM0.867188 7.91699V15.417H30.8672V7.91699H0.867188Z" fill="white"/>
                          <path d="M0.867188 9.46387V13.9639H30.8672V9.46387H0.867188ZM13.6641 0.416992V22.917H18.1641V0.416992H13.6641Z" fill="#C8102E"/>
                          </g>
                          <defs>
                          <clipPath id="clip0_1941_9591">
                          <rect x="0.867188" y="0.416992" width="30" height="22.5" rx="1" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>
                        <span className='font-medium'>United Kingdom</span>
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
                      <ul className='flex items-center gap-3'>
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
      <ShowCountriesListModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
