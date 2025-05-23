'use client';
import React, { useState } from 'react';
import RegisterStepOne from '@/components/auth/RegisterStepOne';
import RegisterStepTwo from '@/components/auth/RegisterStepTwo';
import RegisterStepThree from '@/components/auth/RegisterStepThree';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { toast } from 'sonner';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useAuthRegisterMutation } from '@/store/features/auth/authApiService';
import { useDispatch } from 'react-redux';
import { verifyToken } from '@/utils/verifyToken';
import { setUser } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(null);
  const [selectedService, setSelectedService] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [practice, setPractice] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [areaZipcode, setAreaZipcode] = useState('');
  const [areaRange, setAreaRange] = useState('');
  const [practiceInternational, setPracticeInternational] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [soloPractitioner, setSoloPractitioner] = useState('');
  const [companyTeam, setCompanyTeam] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companySize, setCompanySize] = useState('2-10');
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedServiceNames, setSelectedServiceNames] = useState([]);
  const [hasServiceError, setHasServiceError] = useState(false);
  const [areaZipValue, setAreaZipValue] = useState(false);
  const [selectedCountryCode, SetSelectedCountryCode] = useState('AU');
  const selectedCountry = '682c4cc84c93ea5164dde92d';
  const dispatch = useDispatch();
  const router = useRouter();

  console.log('fullName', fullName);
  console.log('selectedService', selectedService);
  console.log('selectedServiceId', selectedServiceId);
  console.log('practice', practice);
  console.log('practiceArea', practiceArea);
  console.log('areaZipcode', areaZipcode);
  console.log('practiceInternational', practiceInternational);
  console.log('username', username);
  console.log('email', email);
  console.log('phone', phone);
  console.log('soloPractitioner', soloPractitioner);
  console.log('companyTeam', companyTeam);
  console.log('companyName', companyName);
  console.log('companyWebsite', companyWebsite);
  console.log('companySize', companySize);
  console.log('setSelectedServiceIds', selectedServiceIds);
  console.log('selectedServiceNames', selectedServiceNames);

  const { data: countrywiseServices, isFetching } =
    useGetCountryWiseServicesQuery(selectedCountry, {
      skip: !selectedCountry, // Skip query if no country is selected
    });

  const handleStep = () => {
    if (step === 1) {
      if (selectedServiceIds.length <= 0) {
        setHasServiceError(true); // add error
        return;
      }

      setHasServiceError(false); // clear error
      setStep(step + 1);
    } else if (step === 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

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

    try {
      const result = await authRegister(formData).unwrap();
      console.log('✅ Registration result:', result);

      if (result?.success && result?.token) {
        showSuccessToast(result?.message || 'Registration successful');

        const token = result.token;
        const userPayload = verifyToken(token);
        console.log('🔐 Decoded user from token:', userPayload);

        if (userPayload) {
          const dispatchUser = dispatch(
            setUser({
              user: result?.data,
              token: result?.token,
            })
          );

          console.log('📦 Dispatched user to store:', dispatchUser);

          if (dispatchUser?.payload?.token) {
            const userType = result?.data?.regUserType;
            console.log('🚦 Redirecting user based on type:', userType);

            if (userType === 'lawyer') {
              router.push(`/lawyer/dashboard`);
            } else if (userType === 'client') {
              router.push(`/client/dashboard`);
            } else if (userType === 'admin') {
              router.push(`/admin`);
            }
          } else {
            console.warn('⚠️ Token not found in dispatch payload');
          }
        } else {
          console.warn('⚠️ Token could not be verified');
        }
      } else {
        const errorMessage =
          result?.errorSources?.[0]?.message ||
          result?.message ||
          'Registration failed.';
        console.error('❌ Registration failed:', errorMessage);
        showErrorToast(errorMessage);
      }
    } catch (error) {
      console.error('❌ API error:', error);
      showErrorToast(error.data.message);
    }
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
                fullName={fullName}
                setFullName={setFullName}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                selectedServiceId={selectedServiceId}
                setSelectedServiceId={setSelectedServiceId}
                selectedServiceIds={selectedServiceIds}
                setSelectedServiceIds={setSelectedServiceIds}
                countrywiseServices={countrywiseServices}
                selectedServiceNames={selectedServiceNames}
                setSelectedServiceNames={setSelectedServiceNames}
                hasServiceError={hasServiceError}
                setHasServiceError={setHasServiceError}
                areaRange={areaRange}
                setAreaRange={setAreaRange}
              />
            )}
            {step === 2 && (
              <RegisterStepTwo
                handleStep={handleStep}
                handleBack={handleBack}
                practice={practice}
                setPractice={setPractice}
                practiceArea={practiceArea}
                setPracticeArea={setPracticeArea}
                areaZipcode={areaZipcode}
                setAreaZipcode={setAreaZipcode}
                practiceInternational={practiceInternational}
                setPracticeInternational={setPracticeInternational}
                areaZipValue={areaZipValue}
                setAreaZipValue={setAreaZipValue}
              />
            )}

            {step === 3 && (
              <RegisterStepThree
                handleBack={handleBack}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                soloPractitioner={soloPractitioner}
                setSoloPractitioner={setSoloPractitioner}
                companyTeam={companyTeam}
                setCompanyTeam={setCompanyTeam}
                companyName={companyName}
                setCompanyName={setCompanyName}
                companyWebsite={companyWebsite}
                setCompanyWebsite={setCompanyWebsite}
                companySize={companySize}
                setCompanySize={setCompanySize}
                handleFinalSubmit={handleFinalSubmit}
                isLoading={isLoading}
                selectedCountryCode={selectedCountryCode}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
