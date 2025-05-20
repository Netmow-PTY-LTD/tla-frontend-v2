'use client';
import React, { useState } from 'react';
import RegisterStepOne from '@/components/auth/RegisterStepOne';
import RegisterStepTwo from '@/components/auth/RegisterStepTwo';
import RegisterStepThree from '@/components/auth/RegisterStepThree';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { toast } from 'sonner';

export default function Register() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(null);
  const [selectedService, setSelectedService] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [practice, setPractice] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [areaZipcode, setAreaZipcode] = useState('');
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
        toast.error('Please Select Law Services');
        setHasServiceError(true); // add error
        return;
      }
      if (!fullName) {
        toast.error('Please put your Full Name');
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
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
