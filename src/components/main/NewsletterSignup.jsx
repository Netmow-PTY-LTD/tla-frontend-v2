import React from 'react';
import { Input } from '../ui/input';

export default function NewsletterSignup() {
  return (
    <section className="newsletter-signup section">
      <div className="container">
        <div className="bg-[var(--secondary-color)] flex flex-col justify-center items-center py-[30px] md:py-[50px] rounded-[20px] gap-10 px-5">
          <div className="max-w-[828px] flex flex-wrap sm:flex-nowrap items-center gap-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
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
                  fill="#fff"
                />
              </g>
            </svg>
            <p className="text-[20px] lg:text-[26px] text-white relative">
              Subscribe today and enjoy exclusive offers, expert insights, and
              first access to legal updates—tailored just for you.{' '}
            </p>
          </div>
          <div className="w-full lg:max-w-[437px] ">
            <form action="">
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
                <input
                  placeholder="Enter email"
                  className="border-1 border-b border-white-300 focus-within:0 rounded-0 bg-transparent h-[44px] text-white placeholder:text-white w-full md:w-[calc(100%-105px)]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[var(--primary-color)] text-[14px] text-[#fff] font-semibold py-2 px-5 rounded-[8px] h-[44px] uppercase"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
