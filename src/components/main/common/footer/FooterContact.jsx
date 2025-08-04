import AppStore from '@/components/icon/AppStore';
import Envelope from '@/components/icon/Envelope';
import GooglePlayStore from '@/components/icon/GooglePlayStore';
import MapMarker from '@/components/icon/MapMarker';
import Phone from '@/components/icon/Phone';
import Link from 'next/link';
import React from 'react';

export default function FooterContact() {
  return (
    <>
      <div className="footer-contact">
        <div className="container">
          <div className="flex flex-wrap justify-between lg:justify-center gap-5 md:gap-10 lg:gap-20 py-2 mt-5">
            <div className="footer-col w-full sm:w-[calc(50%-20px)] md:max-w-[380px] pr-0 md:pr-10 border-1 md:border-r border-[#DCE2EA]">
              <div className="flex items-center gap-4">
                <div className="icon">
                  <MapMarker />
                </div>
                <span className="text-[14px] md:text-[16px] text-[#0B1C2D] font-medium">
                  Address
                </span>
              </div>
              <div className="address-text text-[#34495E] text-[14px] mt-4">
                Suit 8/3, Level 3/54 Jephson ST, Toowong QLD 4066, Australia
              </div>
            </div>
            <div className="footer-col w-full sm:w-[calc(50%-20px)] md:w-auto pr-0 md:pr-20 md:border-1 md:border-r border-[#DCE2EA]">
              <div className="flex items-center gap-4">
                <div className="icon">
                  <Phone />
                </div>
                <span className="text-[14px] md:text-[16px] text-[#0B1C2D] font-medium">
                  Phone
                </span>
              </div>
              <div className="address-text text-[#34495E] text-[14px] mt-4">
                +610490 135 339
              </div>
            </div>
            <div className="footer-col w-full sm:w-[calc(50%-20px)] md:w-auto">
              <div className="flex items-center gap-4">
                <div className="icon">
                  <Envelope />
                </div>
                <span className="text-[14px] md:text-[16px] text-[#0B1C2D] font-medium">
                  Email
                </span>
              </div>
              <div className="address-text text-[#34495E] text-[14px] mt-4">
                info@thelawapp.com.au
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-[21px] my-[30px]">
            <Link href="#">
              <AppStore />
            </Link>
            <Link href="#">
              <GooglePlayStore />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
