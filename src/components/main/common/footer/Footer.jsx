import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="main-footer"
      style={{ backgroundImage: `url('/assets/img/footer_bg.png')` }}
    >
      <div className="footer-top">
        <div className="container">
          <div className="footer-top-row flex flex-wrap justify-between items-center gap-6">
            <div className="footer-top-col">
              <Link href="/">
                <Image
                  src={"/assets/img/logo.png"}
                  alt="TLA Logo"
                  width={120}
                  height={27}
                />
              </Link>
            </div>
            <div className="footer-top-col flex gap-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Group 1">
                  <path
                    id="Vector"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.751 0.508295C12.5676 -0.122557 11.604 -0.122557 11.4206 0.508295L11.1621 1.40247C10.6032 3.32976 9.84066 4.8346 7.76717 5.35317L6.80433 5.59388C6.66138 5.62233 6.53271 5.69946 6.44025 5.81213C6.34779 5.92481 6.29726 6.06605 6.29726 6.21181C6.29726 6.35756 6.34779 6.49881 6.44025 6.61148C6.53271 6.72416 6.66138 6.80129 6.80433 6.82973L7.76717 7.07044C9.84066 7.58982 10.6032 9.09466 11.1621 11.0211L11.4206 11.9153C11.604 12.547 12.5676 12.547 12.751 11.9153L13.0095 11.0211C13.5684 9.09466 14.3317 7.58983 16.4052 7.07125L17.3665 6.82973C17.5094 6.80129 17.6381 6.72416 17.7305 6.61148C17.823 6.49881 17.8735 6.35756 17.8735 6.21181C17.8735 6.06605 17.823 5.92481 17.7305 5.81213C17.6381 5.69946 17.5094 5.62233 17.3665 5.59388L16.4052 5.35317C14.3317 4.8346 13.5684 3.32976 13.0095 1.40328L12.751 0.508295Z"
                    fill="#00C3C0"
                  />
                  <path
                    id="Vector_2"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.76481 9.59642C4.65495 9.20224 4.07661 9.20224 3.96756 9.59642L3.81167 10.1554C3.47645 11.3589 3.01926 12.3 1.77452 12.6247L1.19779 12.7749C1.11073 12.7953 1.03314 12.8446 0.977604 12.9147C0.922067 12.9848 0.891846 13.0716 0.891846 13.161C0.891846 13.2504 0.922067 13.3372 0.977604 13.4073C1.03314 13.4774 1.11073 13.5267 1.19779 13.5471L1.77452 13.6982C3.01846 14.0221 3.47645 14.9631 3.81167 16.1666L3.96756 16.7256C4.07661 17.1206 4.65495 17.1206 4.76481 16.7256L4.9207 16.1666C5.25511 14.9631 5.71391 14.0221 6.95785 13.6982L7.53458 13.5471C7.62163 13.5267 7.69923 13.4774 7.75477 13.4073C7.8103 13.3372 7.84052 13.2504 7.84052 13.161C7.84052 13.0716 7.8103 12.9848 7.75477 12.9147C7.69923 12.8446 7.62163 12.7953 7.53458 12.7749L6.95785 12.6247C5.71391 12.3008 5.25511 11.3597 4.9207 10.1554L4.76481 9.59642Z"
                    fill="#FF8602"
                  />
                </g>
              </svg>

              <p>
                Get your desired lawyer or client within a reasonable costing.{" "}
              </p>
            </div>
            <div className="">
              <Link href="/pricing" className="btn-pricing">
                <span>See Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-middle">
        <div className="container">
          <div className="footer-middle-widgets">
            <div className="footer-info">
              <div className="footer-text">
                The Law App is changing the way people find legal help and how
                lawyers grow their practice. Whether you’re a client in need of
                expert advice or a lawyer looking to expand your reach, TLA
                makes the process seamless, transparent, and efficient.
              </div>
            </div>
            <div className="footer-widget">
              <h3>Navigate</h3>
              <ul>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/blog">Press</Link>
                </li>
              </ul>
            </div>
            <div className="footer-widget">
              <h3>For Clients</h3>
              <ul>
                <li>
                  <Link href="/about">Find Lawyers</Link>
                </li>
                <li>
                  <Link href="/contact">How IT Works</Link>
                </li>
                <li>
                  <Link href="/pricing">Login Client</Link>
                </li>
              </ul>
            </div>
            <div className="footer-widget">
              <h3>For Lawyers</h3>
              <ul>
                <li>
                  <Link href="/about">Find Clients</Link>
                </li>
                <li>
                  <Link href="/contact">How It Works</Link>
                </li>
                <li>
                  <Link href="/pricing">Login Lawyer</Link>
                </li>
              </ul>
            </div>
            <div className="footer-widget">
              <h3>Other Pages</h3>
              <ul>
                <li>
                  <Link href="/faq">FAQs</Link>
                </li>
                <li>
                  <Link href="/contact">Disclaimer</Link>
                </li>
                <li>
                  <Link href="/pricing">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/blog">Terms of Use</Link>
                </li>
              </ul>
            </div>
            <div className="footer-contact">
              <h3>Contact Us</h3>
              <div className="footer-address">
                <ul>
                  <li>
                    <Link href="#">
                      <b>Address:</b>{" "}
                      <span>
                        Suite 8/3, Level 3/54 Jephson ST, Toowong QLD 4066,
                        Australia
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="tel:0490 135 339">
                      <b>Phone:</b> 0490 135 339
                    </Link>
                  </li>
                  <li>
                    <Link href="mailto:info@thelawapp.com.au">
                      <b>Email:</b> <span>info@thelawapp.com.au</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="footer-copyright">
              <p>
                Copyright &copy; {new Date().getFullYear()} The Law App. All
                rights reserved.
              </p>
            </div>
            <div className="footer-social flex items-center gap-4">
              <b>Follow us at:</b>
              <Link href="#" className="linkedin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <path
                    d="M4.07727 5.39131H0.794623C0.759976 5.39117 0.725642 5.39787 0.693592 5.41103C0.661542 5.42419 0.632406 5.44355 0.607856 5.468C0.583307 5.49244 0.563827 5.5215 0.550535 5.5535C0.537244 5.58549 0.530402 5.6198 0.530402 5.65445V16.1972C0.530402 16.3418 0.648921 16.4603 0.794623 16.4603H4.07618C4.14597 16.4603 4.2129 16.4326 4.26224 16.3832C4.31159 16.3339 4.33931 16.267 4.33931 16.1972V5.65445C4.33931 5.58503 4.31189 5.51843 4.26301 5.46915C4.21414 5.41986 4.14668 5.39189 4.07727 5.39131ZM2.43866 0.150391C1.86468 0.150678 1.31426 0.37867 0.908186 0.784334C0.502114 1.19 0.273569 1.74019 0.272705 2.31417C0.272705 3.50697 1.24369 4.47796 2.43866 4.47796C3.63146 4.47796 4.60245 3.50697 4.60245 2.31417C4.60245 1.12137 3.63146 0.150391 2.43866 0.150391ZM12.4247 5.13035C11.1068 5.13035 10.1326 5.69576 9.54109 6.34055V5.65553C9.54109 5.58575 9.51337 5.51882 9.46402 5.46947C9.41467 5.42012 9.34775 5.3924 9.27796 5.3924H6.13558C6.10093 5.39226 6.0666 5.39896 6.03455 5.41212C6.0025 5.42528 5.97336 5.44464 5.94881 5.46908C5.92426 5.49353 5.90478 5.52259 5.89149 5.55458C5.8782 5.58658 5.87136 5.62089 5.87136 5.65553V16.1972C5.87136 16.3429 5.98879 16.4614 6.13449 16.4614H9.40952C9.44417 16.4614 9.47848 16.4546 9.51047 16.4413C9.54247 16.428 9.57153 16.4085 9.59597 16.3839C9.62042 16.3594 9.63978 16.3303 9.65294 16.2982C9.6661 16.2662 9.6728 16.2318 9.67266 16.1972V10.9813C9.67266 9.22414 10.1511 8.53913 11.3754 8.53913C12.7096 8.53913 12.8161 9.63733 12.8161 11.0726V16.1972C12.8161 16.3429 12.9336 16.4614 13.0793 16.4614H16.3554C16.39 16.4614 16.4243 16.4546 16.4563 16.4413C16.4883 16.428 16.5174 16.4085 16.5418 16.3839C16.5663 16.3594 16.5856 16.3303 16.5988 16.2982C16.612 16.2662 16.6187 16.2318 16.6185 16.1972V10.4148C16.6185 7.80192 16.1205 5.13035 12.4247 5.13035Z"
                    fill="#0B1C2D"
                  />
                </svg>
              </Link>
              <Link href="#" className="fb">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="17"
                  viewBox="0 0 10 17"
                  fill="none"
                >
                  <path
                    d="M3.14222 9.35595H1.05999C0.724001 9.35595 0.61853 9.23417 0.61853 8.92755V6.45822C0.61853 6.13203 0.74466 6.02873 1.05999 6.02873H3.14222V4.23246C3.14222 3.41697 3.28901 2.64061 3.7098 1.92624C4.15126 1.19121 4.78191 0.700821 5.58001 0.414853C6.10089 0.23448 6.64893 0.145101 7.20013 0.150632H9.25953C9.55311 0.150632 9.68032 0.272413 9.68032 0.558381V2.88526C9.68032 3.17123 9.55419 3.2941 9.25953 3.2941C8.69194 3.2941 8.12436 3.2941 7.55677 3.31367C6.98919 3.31367 6.69452 3.57898 6.69452 4.15091C6.67277 4.76308 6.69452 5.35567 6.69452 5.9885H9.1334C9.47047 5.9885 9.59551 6.11028 9.59551 6.43757V8.90689C9.59551 9.23309 9.49113 9.33638 9.1334 9.33638H6.69452V15.9908C6.69452 16.3377 6.59014 16.4595 6.21175 16.4595H3.58367C3.26835 16.4595 3.14222 16.3377 3.14222 16.0311V9.35595Z"
                    fill="#0B1C2D"
                  />
                </svg>
              </Link>
              <Link href="#" className="twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <path
                    d="M10.3923 7.05601L16.4672 0.150391H15.0276L9.75188 6.14701L5.54066 0.150391H0.680298L7.05204 9.21871L0.680298 16.4603H2.12101L7.69139 10.1277L12.1407 16.4603H17L10.3901 7.05492L10.3923 7.05601ZM8.4199 9.29808L7.77403 8.3956L2.63858 1.20945H4.84912L8.99401 7.00817L9.63988 7.91065L15.0276 15.448H12.8171L8.4199 9.29808Z"
                    fill="#0B1C2D"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
