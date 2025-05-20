'use client';
import React, { useState } from 'react';
import RegisterStepOne from '@/components/auth/RegisterStepOne';
import RegisterStepTwo from '@/components/auth/RegisterStepTwo';
import RegisterStepThree from '@/components/auth/RegisterStepThree';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { toast } from 'sonner';
import { showErrorToast } from '@/components/common/toasts';

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

  const selectedCountry = '6825904407058a57bd0fe192';

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

    try {
      const response = await fetch(
        'https://tla-backend-v2.vercel.app/api/v1/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok || !data.success) {
        // Check if errorSources exist
        const errorMessage =
          data?.errorSources?.[0]?.message ||
          data?.message ||
          'Registration failed.';
        showErrorToast(errorMessage); // Replace with toast or UI display as needed
        return;
      }

      // Success case
      if (data.success && data.token) {
        window.location.href = `/lawyer?token=${data.token}`;
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      showErrorToast('Something went wrong. Please try again.');
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
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
