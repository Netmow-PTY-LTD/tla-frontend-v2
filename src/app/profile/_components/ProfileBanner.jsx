import { userDummyImage } from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProfileBanner({ data }) {
  return (
    <section
      className="pt-[50px] md:pt-[100px] pb-[40px] lg:pb-0"
      style={{
        backgroundImage: 'url("/assets/img/Bg-hero1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container">
        <div className="flex flex-wrap gap-5 relative md:top-[30px]">
          <div className="flex">
            <Image
              src={data?.profilePicture || userDummyImage}
              width={423}
              height={531}
              alt={data?.name || 'Profile Image'}
              className="max-w-full h-auto lg:h-[523px] rounded-lg object-cover"
            />
          </div>
          <div className="lg:pl-[100px]">
            <h2 className="text-[48px] font-medium text-white">{data?.name}</h2>
            <div className="text-[18px] font-medium text-white mt-4">
              {data?.designation || 'Lawyer'}
            </div>
            <div className="w-[142px] h-[0.5px] bg-white mt-4 opacity-[0.5]" />
            <div className="flex flex-col gap-5 mt-10">
              <Link
                href={`mailto:${data?.email}`}
                className="text-white text-[16px] font-semibold flex items-center gap-4"
              >
                <div className="w-[40px] h-[40px] flex items-center justify-center border border-1 border-white  rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                  >
                    <path
                      d="M17.5977 3.84375H4.26432C3.34766 3.84375 2.60599 4.59375 2.60599 5.51042L2.59766 15.5104C2.59766 16.4271 3.34766 17.1771 4.26432 17.1771H17.5977C18.5143 17.1771 19.2643 16.4271 19.2643 15.5104V5.51042C19.2643 4.59375 18.5143 3.84375 17.5977 3.84375ZM17.5977 7.17708L10.931 11.3438L4.26432 7.17708V5.51042L10.931 9.67708L17.5977 5.51042V7.17708Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span>{data?.email || ''}</span>
              </Link>
              <Link
                href={`tel:${data?.phone || ''}`}
                className="text-white text-[16px] font-semibold flex items-center gap-4"
              >
                <div className="w-[40px] h-[40px] flex items-center justify-center border border-1 border-white  rounded-full">
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                  >
                    <path
                      d="M17.5557 18.0098C17.8057 18.0098 18.014 17.9264 18.1807 17.7598C18.3473 17.5931 18.4307 17.3848 18.4307 17.1348V13.7598C18.4307 13.5792 18.3682 13.4162 18.2432 13.2706C18.1182 13.125 17.9584 13.0242 17.764 12.9681L14.889 12.3848C14.6946 12.357 14.4965 12.3745 14.2948 12.4373C14.0932 12.5 13.9301 12.5937 13.8057 12.7181L11.8473 14.6764C11.3196 14.3709 10.8196 14.0339 10.3473 13.6656C9.87511 13.2973 9.42372 12.8981 8.99316 12.4681C8.53483 12.0237 8.11455 11.562 7.73233 11.0831C7.35011 10.6042 7.02039 10.1075 6.74317 9.5931L8.764 7.55143C8.87511 7.44032 8.9515 7.30838 8.99316 7.1556C9.03483 7.00282 9.04178 6.81532 9.014 6.5931L8.47233 3.67643C8.44455 3.49588 8.35428 3.33977 8.2015 3.2081C8.04872 3.07643 7.87511 3.01032 7.68067 3.00977H4.30566C4.05566 3.00977 3.84733 3.0931 3.68066 3.25977C3.514 3.42643 3.43066 3.63477 3.43066 3.88477C3.43066 5.62088 3.809 7.33615 4.56566 9.0306C5.32233 10.725 6.39539 12.2667 7.78483 13.6556C9.17428 15.0445 10.7159 16.1175 12.4098 16.8748C14.1037 17.632 15.819 18.0103 17.5557 18.0098Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <span>{data?.phone ?? ''}</span>
              </Link>
              <Link
                href="/lawyer/settings/profile"
                className="text-white text-[16px] font-semibold flex items-center gap-4"
              >
                <div className="w-[40px] h-[40px] flex items-center justify-center border border-1 border-white  rounded-full">
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                  >
                    <path
                      d="M10.1325 17.9382C9.93804 17.9382 9.7436 17.9034 9.54915 17.834C9.35471 17.7645 9.1811 17.6604 9.02832 17.5215C8.12554 16.6882 7.32693 15.8757 6.63249 15.084C5.93804 14.2923 5.35832 13.5251 4.89332 12.7823C4.42832 12.0395 4.07415 11.3243 3.83082 10.6365C3.58749 9.94871 3.46582 9.29232 3.46582 8.66732C3.46582 6.58398 4.1361 4.92426 5.47665 3.68815C6.81721 2.45204 8.36915 1.83398 10.1325 1.83398C11.8958 1.83398 13.448 2.45204 14.7892 3.68815C16.1303 4.92426 16.8003 6.58398 16.7992 8.66732C16.7992 9.29232 16.6778 9.94871 16.435 10.6365C16.1922 11.3243 15.838 12.0395 15.3725 12.7823C14.9069 13.5251 14.3269 14.2923 13.6325 15.084C12.938 15.8757 12.1394 16.6882 11.2367 17.5215C11.0839 17.6604 10.9103 17.7645 10.7158 17.834C10.5214 17.9034 10.3269 17.9382 10.1325 17.9382ZM10.1325 10.1673C10.5908 10.1673 10.9833 10.0043 11.31 9.67815C11.6367 9.35204 11.7997 8.95954 11.7992 8.50065C11.7986 8.04176 11.6355 7.64954 11.31 7.32399C10.9844 6.99843 10.5919 6.8351 10.1325 6.83398C9.67304 6.83287 9.28082 6.99621 8.95582 7.32399C8.63082 7.65176 8.46749 8.04398 8.46582 8.50065C8.46415 8.95732 8.62749 9.34982 8.95582 9.67815C9.28415 10.0065 9.67638 10.1695 10.1325 10.1673Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span>{data?.address}</span>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-16">
              <Link
                href="/lawyer/settings/profile"
                className="text-white text-base font-medium flex items-center gap-2 bg-[#FF8602] rounded-[6px] py-[12px] px-[63px] hover:bg-[#e07502] transition-all duration-300"
              >
                <span>Download vCard</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_952_5372)">
                    <path
                      d="M6.34749 16.6771C5.0836 16.6771 4.00388 16.2396 3.10833 15.3646C2.21277 14.4896 1.76472 13.4201 1.76416 12.1562C1.76416 11.0729 2.09055 10.1076 2.74333 9.26042C3.3961 8.41319 4.25027 7.87153 5.30583 7.63542C5.62527 6.51042 6.21916 5.56597 7.08749 4.80208C7.95583 4.03819 8.95916 3.57292 10.0975 3.40625V10.1354L9.34749 9.40625C9.19472 9.25347 9.00388 9.17708 8.77499 9.17708C8.5461 9.17708 8.34805 9.26042 8.18083 9.42708C8.02805 9.57986 7.95166 9.77431 7.95166 10.0104C7.95166 10.2465 8.02805 10.441 8.18083 10.5938L10.3475 12.7604C10.5142 12.9271 10.7086 13.0104 10.9308 13.0104C11.153 13.0104 11.3475 12.9271 11.5142 12.7604L13.6808 10.5938C13.8336 10.441 13.9133 10.2501 13.92 10.0212C13.9267 9.79236 13.8469 9.59431 13.6808 9.42708C13.528 9.27431 13.3372 9.19431 13.1083 9.18708C12.8794 9.17986 12.6814 9.25292 12.5142 9.40625L11.7642 10.1354V3.40625C13.1947 3.60069 14.3858 4.24319 15.3375 5.33375C16.2892 6.42431 16.7647 7.70542 16.7642 9.17708C17.7225 9.28819 18.5178 9.70153 19.15 10.4171C19.7822 11.1326 20.098 11.9693 20.0975 12.9271C20.0975 13.9688 19.733 14.8543 19.0042 15.5837C18.2753 16.3132 17.3897 16.6776 16.3475 16.6771H6.34749Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_952_5372">
                      <rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="translate(0.930664 0.00976562)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link
                href="/lawyer/settings/profile"
                className="text-white text-base font-medium flex items-center gap-2 border border-1 border-[#FF8602] rounded-[6px] py-[12px] px-[63px] hover:bg-[#e07502] transition-all duration-300"
              >
                <span>Print</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M15.9305 5.8431H5.9305V2.50977H15.9305V5.8431ZM15.9305 10.4264C16.1666 10.4264 16.3647 10.3464 16.5247 10.1864C16.6847 10.0264 16.7644 9.82865 16.7638 9.5931C16.7633 9.35754 16.6833 9.15977 16.5238 8.99977C16.3644 8.83977 16.1666 8.75977 15.9305 8.75977C15.6944 8.75977 15.4966 8.83977 15.3372 8.99977C15.1777 9.15977 15.0977 9.35754 15.0972 9.5931C15.0966 9.82865 15.1766 10.0267 15.3372 10.1873C15.4977 10.3478 15.6955 10.4275 15.9305 10.4264ZM14.2638 15.8431V12.5098H7.59717V15.8431H14.2638ZM15.9305 17.5098H5.9305V14.1764H2.59717V9.17643C2.59717 8.4681 2.84022 7.87449 3.32633 7.3956C3.81245 6.91671 4.40272 6.67699 5.09717 6.67643H16.7638C17.4722 6.67643 18.0661 6.91615 18.5455 7.3956C19.0249 7.87504 19.2644 8.46865 19.2638 9.17643V14.1764H15.9305V17.5098Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
