"use client";
import React, { useState } from "react";
import RegisterStepOne from "@/components/auth/RegisterStepOne";
import RegisterStepTwo from "@/components/auth/RegisterStepTwo";
import RegisterStepThree from "@/components/auth/RegisterStepThree";

export default function Register() {
  const [step, setStep] = useState(1);
  const handleStep = () => {
    if (step === 1) {
      setStep(step + 1);
    } else if (step === 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  return (
    <section
      className="tla-auth-section"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper">
          <div className="tla-auth-box">
            {step === 1 && (
              <RegisterStepOne
                step={step}
                setStep={setStep}
                handleStep={handleStep}
              />
            )}
            {step === 2 && (
              <RegisterStepTwo
                handleStep={handleStep}
                handleBack={handleBack}
              />
            )}

            {step === 3 && <RegisterStepThree handleBack={handleBack} />}
          </div>
        </div>
      </div>
    </section>
  );
}
