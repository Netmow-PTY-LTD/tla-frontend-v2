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
      className="tla-auth-section flex items-center"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper">
          <div className="tla-auth-box">
            {step === 1 && <RegisterStepOne />}
            {step === 2 && <RegisterStepTwo />}
            {step === 3 && <RegisterStepThree />}
          </div>
        </div>
      </div>
    </section>
  );
}
