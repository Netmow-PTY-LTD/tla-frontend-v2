'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import HeroShowcase from './HeroShowcase';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import ClientLeadRegistrationModal from './modal/ClientLeadRegistrationModal';
import { useSelector } from 'react-redux';
import CreateLeadWithAuthModal from './modal/CreateLeadWithAuthModal';
import { Loader } from 'lucide-react';
import HeroSlider from '../common/HeroSlider';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
export default function HeroHome() {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setServiceWiseQuestions(null); // Reset serviceWiseQuestions when opening the modal
    setModalOpen(true);
  };

  const { data: countryList } = useGetCountryListQuery();

  const defaultCountry = countryList?.data?.find(
    (country) => country?.slug === 'au'
  );

  // Default to Australia (AU) if available
  const { data: countryWiseServices, isLoading: isCountryWiseServicesLoading } =
    useGetCountryWiseServicesQuery(defaultCountry?._id, {
      skip: !defaultCountry?._id, // Skip
    });

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

  useEffect(() => {
    setServiceWiseQuestions(singleServicewiseQuestionsData?.data || []);
  }, [singleServicewiseQuestionsData]);

  const token = useSelector((state) => state.auth.token);

  const { data: currentUser } = useAuthUserInfoQuery(undefined, {
    skip: !token,
  });

  return (
    <section className="hero-home section">
      <div className="container">
        <div className="hero-content py-[50px]">
          {/* <h3>Get a quote for legal services.</h3> */}
          <h1>Need a Lawyer?</h1>
          <p className="text-[#444] text-2xl font-medium">
            Get Free Quotes in Minutes.
          </p>
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
                </button>
              </div>
            </div>
          </form>
          <div className="flex flex-wrap gap-2 w-full suggestion-area">
            <b>Popular</b>:
            {isCountryWiseServicesLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              countryWiseServices?.data?.length > 0 &&
              countryWiseServices?.data?.slice(0, 5).map((service) => (
                <Link
                  href="#"
                  className="flex justify-center items-center gap-[10px] text-center w-[calc(50%-10px)] sm:w-auto border py-1 px-3 rounded-full"
                  key={service?._id}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    setSelectedService(service);
                    handleModalOpen();
                  }}
                >
                  <h6>{service?.name}</h6>
                </Link>
              ))
            )}
          </div>
        </div>
        <HeroSlider />
        {/* <HeroShowcase /> */}
      </div>

      {token && currentUser ? (
        <CreateLeadWithAuthModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleModalOpen={handleModalOpen}
          selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
          countryId={defaultCountry?._id}
          serviceId={selectedService?._id}
          locationId={currentUser?.data?.profile?.zipCode}
        />
      ) : (
        <ClientLeadRegistrationModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleModalOpen={handleModalOpen}
          selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
          countryId={defaultCountry?._id}
          serviceId={selectedService?._id}
        />
      )}
    </section>
  );
}
