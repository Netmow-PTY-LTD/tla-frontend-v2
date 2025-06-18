'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import HeroShowcase from './HeroShowcase';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import ClientLeadRegistrationModal from './modal/ClientLeadRegistrationModal';

export default function HeroHome() {
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const { data: countryList } = useGetCountryListQuery();

  const defaultCountry = countryList?.data?.find(
    (country) => country?.slug === 'au'
  );

  // Default to Australia (AU) if available
  const { data: countryWiseServices } = useGetCountryWiseServicesQuery(
    defaultCountry?._id,
    {
      skip: !defaultCountry?._id, // Skip
    }
  );

  //console.log('countryWiseServices', countryWiseServices);

  const {
    data: singleServicewiseQuestionsData,
    isLoading: isQuestionsLoading,
    refetch,
  } = useGetServiceWiseQuestionsQuery(
    {
      countryId: defaultCountry?._id,
      serviceId: selectedService?._id,
    },
    {
      skip: !defaultCountry?._id || !selectedService?._id,
    }
  );

  // console.log('selectedService', selectedService);

  // console.log(
  //   'singleServicewiseQuestionsData',
  //   singleServicewiseQuestionsData?.data
  // );

  return (
    <section
      className="hero-home section"
      style={{ backgroundImage: `url('/assets/img/auth-bg.png')` }}
    >
      <div className="container">
        <div className="hero-content">
          <h3>Get a quote for legal services.</h3>
          <h1>
            Need legal help? <br /> Find a{' '}
            <span className="text-[var(--primary-color)]">lawyer</span> . On
            your terms.
          </h1>
          <form className="w-full">
            <div className="hero-search-area flex flex-wrap md:flex-nowrap gap-2 items-center w-full">
              <div className="tla-form-group w-full lg:w-5/12">
                <input
                  type="text"
                  className="tla-form-control"
                  placeholder="What area of law are you interested in?"
                />
              </div>
              <div className="tla-form-group w-full md:w-5/12">
                <input
                  type="text"
                  className="tla-form-control"
                  placeholder="Your location"
                />
              </div>
              <div className="tla-btn-wrapper w-full md:w-2/3 lg:w-1/6">
                <button type="submit" className="tla-btn-search">
                  <span>Get Started</span>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10.8048 11.1297L14.6509 14.9642M12.4339 7.20484C12.4339 10.2658 9.95247 12.7473 6.8915 12.7473C3.83049 12.7473 1.34906 10.2658 1.34906 7.20484C1.34906 4.14383 3.83049 1.6624 6.8915 1.6624C9.95247 1.6624 12.4339 4.14383 12.4339 7.20484Z"
                      stroke="#Fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg> */}
                </button>
              </div>
            </div>
          </form>
          <div className="flex flex-wrap justify-center gap-4 w-full mt-5 suggestion-area">
            {countryWiseServices?.data?.length > 0 &&
              countryWiseServices?.data.map((service) => (
                <Link
                  href="#"
                  className="flex flex-col items-center gap-[10px] text-center w-[calc(50%-10px)] sm:w-auto"
                  key={service?._id}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default anchor behavior
                    setSelectedService(service);
                    handleModalOpen();
                  }}
                >
                  <Image
                    src={`/assets/img/img-4.png`}
                    width={70}
                    height={70}
                    className="object-cover"
                    alt={'service img'}
                  />
                  <h6>{service?.name}</h6>
                </Link>
              ))}
          </div>
        </div>
        <HeroShowcase />
      </div>
      <ClientLeadRegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedServiceWiseQuestions={
          singleServicewiseQuestionsData?.data ?? []
        }
        isLoading={isQuestionsLoading}
        countryId={defaultCountry?._id}
        serviceId={selectedService?._id}
      />
    </section>
  );
}
