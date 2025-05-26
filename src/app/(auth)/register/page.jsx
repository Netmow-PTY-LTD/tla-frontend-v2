'use client';
import React, { useState } from 'react';
import RegisterStepOne from '@/components/auth/RegisterStepOne';
import RegisterStepTwo from '@/components/auth/RegisterStepTwo';
import RegisterStepThree from '@/components/auth/RegisterStepThree';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { toast } from 'sonner';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useAuthRegisterMutation } from '@/store/features/auth/authApiService';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '@/utils/verifyToken';
import { setUser } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import RegisterStepOneTest from '@/components/auth/RegisterStepOneTest';
import RegisterStepTwoTest from '@/components/auth/RegisterStepTwoTest';
import RegisterStepThreeTest from '@/components/auth/RegisterStepThreeTest';

export default function RegisterTest() {
  const step = useSelector((state) => state.lawyerRegistration.step);
  const selectedCountry = '682ecd01e6b730f229c8d3d3';
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: countrywiseServices, isFetching } =
    useGetCountryWiseServicesQuery(selectedCountry, {
      skip: !selectedCountry, // Skip query if no country is selected
    });

  // const handleStep = () => {
  //   if (step === 1) {
  //     if (selectedServiceIds.length <= 0) {
  //       setHasServiceError(true); // add error
  //       return;
  //     }

  //     setHasServiceError(false); // clear error
  //     setStep(step + 1);
  //   } else if (step === 2) {
  //     setStep(step + 1);
  //   }
  // };

  // const handleBack = () => {
  //   if (step > 1) setStep(step - 1);
  // };

  const [authRegister, { isLoading }] = useAuthRegisterMutation();

  const handleFinalSubmit = async () => {
    const formData = {
      fullName,
      selectedServiceIds,
      practice,
      areaZipcode,
      practiceArea,
      practiceInternational,
      username,
      email,
      phone,
      soloPractitioner,
      companyTeam,
      companyName,
      companyWebsite,
      companySize,
      role: 'user',
      regUserType: 'lawyer',
      password: '123456',
      profile: {
        name: fullName,
        activeProfile: 'basic',
      },
    };

    console.log('🔄 Submitting registration form:', formData);

    // try {
    //   const result = await authRegister(formData).unwrap();
    //   console.log('✅ Registration result:', result);

    //   if (result?.success && result?.token) {
    //     showSuccessToast(result?.message || 'Registration successful');

    //     const token = result.token;
    //     const userPayload = verifyToken(token);
    //     console.log('🔐 Decoded user from token:', userPayload);

    //     if (userPayload) {
    //       const dispatchUser = dispatch(
    //         setUser({
    //           user: result?.data,
    //           token: result?.token,
    //         })
    //       );

    //       console.log('📦 Dispatched user to store:', dispatchUser);

    //       if (dispatchUser?.payload?.token) {
    //         const userType = result?.data?.regUserType;
    //         console.log('🚦 Redirecting user based on type:', userType);

    //         if (userType === 'lawyer') {
    //           router.push(`/lawyer/dashboard`);
    //         } else if (userType === 'client') {
    //           router.push(`/client/dashboard`);
    //         } else if (userType === 'admin') {
    //           router.push(`/admin`);
    //         }
    //       } else {
    //         console.warn('⚠️ Token not found in dispatch payload');
    //       }
    //     } else {
    //       console.warn('⚠️ Token could not be verified');
    //     }
    //   } else {
    //     const errorMessage =
    //       result?.errorSources?.[0]?.message ||
    //       result?.message ||
    //       'Registration failed.';
    //     console.error('❌ Registration failed:', errorMessage);
    //     showErrorToast(errorMessage);
    //   }
    // } catch (error) {
    //   console.error('❌ API error:', error);
    //   showErrorToast(error.data.message);
    // }
  };

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
