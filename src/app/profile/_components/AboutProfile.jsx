import Facebook from '@/components/icon/Facebook';
import GradientLine from '@/components/icon/GradientLine';
import LinkedIn from '@/components/icon/LinkedIn';
import Share from '@/components/icon/Share';
import Twitter from '@/components/icon/Twiiter';
import { data } from 'autoprefixer';
import Link from 'next/link';
import React from 'react';

export default function AboutProfile({ data }) {
  return (
    <section className="pt-[80px] pb-[20px]">
      <div className="container">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-8/12">
            <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
              <span>About</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="62"
                height="4"
                viewBox="0 0 62 4"
                fill="none"
              >
                <rect
                  x="0.138672"
                  y="0.201172"
                  width="11.3115"
                  height="3.40625"
                  rx="1.70312"
                  fill="#D9D9D9"
                />
                <rect
                  x="17.4512"
                  y="0.201172"
                  width="44.5493"
                  height="3.40625"
                  rx="1.70312"
                  fill="#00C3C0"
                />
              </svg>
            </h2>
            <div className="text-[16px] text-black pr-0 lg:pr-20">
              {data?.bio || ''}
            </div>
          </div>

          <div className="w-full lg:w-1/3 pl-8 flex gap-10">
            <div className="related-areas relative">
              <h2 className="text-[24px] font-semibold mb-4">
                Related areas of expertise{' '}
              </h2>
              <div className="">
                {Array.isArray(data?.services) && data?.services?.length > 0 ? (
                  data?.services?.map((service, index) => (
                    <div key={service + index}>
                      <span className="border border-gray-300 py-2 px-4 mr-2 mb-2 rounded-lg text-center inline-block">
                        {service}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    No services available.
                  </div>
                )}
              </div>
              <h2 className="text-[18px] font-semibold mb-4 mt-8">Share</h2>
              <div className="flex flex-wrap gap-5">
                <Link
                  href={data?.socialMedia?.facebook || '#'}
                  className="mr-2 mb-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-6 h-6 text-gray-600" />
                </Link>
                <Link
                  href={data?.socialMedia?.twitter || '#'}
                  className="mr-2 mb-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-6 h-6 text-gray-600" />
                </Link>
                {/* <Link href={data?.socialMedia?.facebook || '#'} className="mr-2 mb-2">
                  <LinkedIn className="w-6 h-6 text-gray-600" />
                </Link>
              
                <Link href="#" className="mr-2 mb-2">
                  <Share className="w-6 h-6 text-gray-600" />
                </Link> */}
              </div>
            </div>
          </div>
          <style>
            {`
              .related-areas {
                position: relative;
                padding-left: 50px; /* Adjust as needed for spacing */
              }
              .related-areas::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 1px; 
                height: 100%;
                background-color: rgba(0, 204, 179, 0.20);
              }
            `}
          </style>
        </div>
      </div>
    </section>
  );
}
