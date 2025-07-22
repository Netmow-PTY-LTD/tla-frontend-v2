import React from 'react';
import LoginForm from '@/components/auth/login/LoginForm';
import Image from 'next/image';

export default function Login() {
  return (
    <section
      className="tla-auth-section flex justify-center items-center py-8"
      // style={{ backgroundImage: `url('/assets/img/auth-bg.png')` }}
    >
      <div className="tla-auth-box max-w-[900px] w-full mx-auto">
        <div className="flex flex-wrap w-full">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-[20px] md:p-[38px] relative">
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-[150px] h-[150px] rounded-full bg-[#00C3C080] blur-[70px]"></div>
            </div>
            <LoginForm />
          </div>
          {/* Image Section (Hidden on mobile) */}
          <div
            className="hidden md:block w-full md:w-1/2"
            style={{
              backgroundImage: `url('/assets/img/law-webp.webp')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              borderRadius: '0 14px 14px 0',
            }}
          >
            <div className="tla-auth-image">
              {/* <Image
                  src="/assets/img/login-img.png"
                  width={215}
                  height={373}
                  alt="Auth Image"
                /> */}
              {/* <div className="tla-auth-login-text">{`Log in to access freelance legal opportunities, manage cases, and grow your independent practice.`}</div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
