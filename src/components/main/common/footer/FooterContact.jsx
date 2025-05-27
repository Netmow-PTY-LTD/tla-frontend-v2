import AppStore from '@/components/icon/AppStore';
import GooglePlayStore from '@/components/icon/GooglePlayStore';
import Link from 'next/link';
import React from 'react';

export default function FooterContact() {
  return (
    <>
      <div className="footer-contact flex flex-wrap lg:justify-center gap-10 lg:gap-20 py-2 px-5">
        <div className="footer-col max-w-[380px] pr-0 md:pr-10 border-1 md:border-r border-[#DCE2EA]">
          <div className="flex items-center gap-4">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <path
                  fill="white"
                  d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"
                />
              </svg>
            </div>
            <span className="text-[14px] md:text-[20px] text-[#0B1C2D] font-medium">
              Address
            </span>
          </div>
          <div className="address-text text-[#34495E] text-[14px] md:text-[20px] mt-4">
            Suit 8/3, Level 3/54 Jephson ST, Toowong QLD 4066, Australia
          </div>
        </div>
        <div className="footer-col pr-0 lg:pr-20 lg:border-1 lg:border-r border-[#DCE2EA]">
          <div className="flex items-center gap-4">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.9948 13.6535V16.0285C17.9957 16.249 17.9505 16.4673 17.8622 16.6693C17.7738 16.8713 17.6443 17.0526 17.4818 17.2017C17.3194 17.3507 17.1275 17.4642 16.9187 17.5349C16.7098 17.6055 16.4885 17.6317 16.2689 17.6119C13.8328 17.3472 11.4928 16.5147 9.43684 15.1815C7.52404 13.966 5.90232 12.3443 4.68684 10.4315C3.34891 8.36616 2.51628 6.01474 2.25643 3.56771C2.23664 3.34879 2.26266 3.12814 2.33282 2.91983C2.40298 2.71151 2.51575 2.52009 2.66395 2.35774C2.81214 2.19539 2.99252 2.06569 3.19359 1.97687C3.39467 1.88806 3.61203 1.84208 3.83184 1.84187H6.20684C6.59104 1.83809 6.96351 1.97414 7.25482 2.22467C7.54613 2.4752 7.7364 2.8231 7.79018 3.20354C7.89042 3.96359 8.07632 4.70987 8.34434 5.42812C8.45086 5.71148 8.47391 6.01943 8.41077 6.31549C8.34763 6.61154 8.20094 6.88329 7.98809 7.09854L6.98268 8.10396C8.10966 10.0859 9.7507 11.727 11.7327 12.854L12.7381 11.8485C12.9533 11.6357 13.2251 11.489 13.5211 11.4259C13.8172 11.3627 14.1252 11.3858 14.4085 11.4923C15.1268 11.7603 15.873 11.9462 16.6331 12.0465C17.0177 12.1007 17.3689 12.2944 17.6199 12.5907C17.871 12.887 18.0044 13.2653 17.9948 13.6535Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[14px] md:text-[20px] text-[#0B1C2D] font-medium">
              Phone
            </span>
          </div>
          <div className="address-text text-[#34495E] text-[14px] md:text-[20px] mt-4">
            0490 135 339
          </div>
        </div>
        <div className="footer-col">
          <div className="flex items-center gap-4">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M3.33366 4.0918H16.667C17.5837 4.0918 18.3337 4.8418 18.3337 5.75846V15.7585C18.3337 16.6751 17.5837 17.4251 16.667 17.4251H3.33366C2.41699 17.4251 1.66699 16.6751 1.66699 15.7585V5.75846C1.66699 4.8418 2.41699 4.0918 3.33366 4.0918Z"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3337 5.75879L10.0003 11.5921L1.66699 5.75879"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[14px] md:text-[20px] text-[#0B1C2D] font-medium">
              Email
            </span>
          </div>
          <div className="address-text text-[#34495E] text-[14px] md:text-[20px] mt-4">
            info@thelawapp.com.au
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-[21px] my-[30px]">
        <Link href="#">
          <AppStore />
        </Link>
        <Link href="#">
          <GooglePlayStore />
        </Link>
      </div>
    </>
  );
}
