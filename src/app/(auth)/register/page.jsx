'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import RegisterStepOne from '@/components/auth/RegisterStepOne';
import RegisterStepTwo from '@/components/auth/RegisterStepTwo';
import RegisterStepThree from '@/components/auth/RegisterStepThree';

export default function Register() {
  const step = useSelector((state) => state.lawyerRegistration.step);

  return (
    <section
      className="tla-auth-section"
      style={{ backgroundImage: `url('/assets/img/auth-bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper flex justify-center items-center">
          <div className="tla-auth-box max-w-[112.5rem]">
            {step === 1 && <RegisterStepOne />}
            {step === 2 && <RegisterStepTwo />}
            {step === 3 && <RegisterStepThree />}
          </div>
        </div>
      </div>
    </section>
  );
}
