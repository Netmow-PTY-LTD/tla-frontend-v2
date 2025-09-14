'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import RegisterStepOne from '@/components/auth/RegisterStepOne';
import RegisterStepTwo from '@/components/auth/RegisterStepTwo';
import LawFirmRegisterStepOne from '../_components/LawFirmRegisterStepOne';
import LawFirmRegisterStepTwo from '../_components/LawFirmRegisterStepTwo';

export default function Register() {
  const step = useSelector((state) => state.lawyerRegistration.step);

  return (
    <section
      className="tla-auth-section"
      // style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper flex justify-center items-center">
          <div className="tla-auth-box max-w-[900px] w-full">
            {step === 1 && <LawFirmRegisterStepOne />}
            {step === 2 && <LawFirmRegisterStepTwo />}
          </div>
        </div>
      </div>
    </section>
  );
}
