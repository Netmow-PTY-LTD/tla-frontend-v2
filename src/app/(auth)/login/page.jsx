import React from 'react';

import LoginForm from '@/components/auth/login/LoginForm';
import Image from 'next/image';
import { Suspense } from 'react';

export default function Login() {
  return (
    <section
      className="tla-auth-section"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper">
          <div className="tla-auth-box">
            <div className="flex flex-wrap items-center">
              {/* Image Section (Hidden on mobile) */}
              <div className="hidden md:block md:w-1/3">
                <div className="tla-auth-image">
                  <Image
                    src="/assets/img/auth-login.png"
                    width={600}
                    height={751}
                    alt="Auth Image"
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-2/3">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
