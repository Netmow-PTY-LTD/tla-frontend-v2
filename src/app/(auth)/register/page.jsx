'use client';
import React from 'react';
import RegisterStepOneTest from '@/components/auth/RegisterStepOneTest';
import RegisterStepTwoTest from '@/components/auth/RegisterStepTwoTest';
import RegisterStepThreeTest from '@/components/auth/RegisterStepThreeTest';
import { useSelector } from 'react-redux';

export default function RegisterTest() {
  const step = useSelector((state) => state.lawyerRegistration.step);

  return (
    <section
      className="tla-auth-section"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper">
          <div className="tla-auth-box">
            {step === 1 && <RegisterStepOneTest />}
            {step === 2 && <RegisterStepTwoTest />}
            {step === 3 && <RegisterStepThreeTest />}
          </div>
        </div>
      </div>
    </section>
  );
}
