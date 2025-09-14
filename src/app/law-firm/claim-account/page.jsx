'use client';
import React from 'react';
import LawFirmClaimAccountStepOne from '../_components/LawFirmClaimAccountStepOne';
import { useSelector } from 'react-redux';
import LawFirmClaimAccountStepTwo from '../_components/LawFirmClaimAccountStepTwo';

export default function LawFirmClaimAccount() {
  const step = useSelector((state) => state.lawyerRegistration.step);

  return (
    <section
      className="tla-auth-section"
      // style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper flex justify-center items-center">
          <div className="tla-auth-box max-w-[900px] w-full">
            {step === 1 && <LawFirmClaimAccountStepOne />}
            {step === 2 && <LawFirmClaimAccountStepTwo />}
          </div>
        </div>
      </div>
    </section>
  );
}
