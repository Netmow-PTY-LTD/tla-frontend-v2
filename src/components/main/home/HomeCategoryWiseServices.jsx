'use client';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useGetAllCategoriesQuery } from '@/store/features/public/catagorywiseServiceApiService';
import {
  useGetCountryListQuery,
  useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import { Ellipsis, MoveRight } from 'lucide-react';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CreateLeadWithAuthModal from './modal/CreateLeadWithAuthModal';
import { toast } from 'sonner';
import ClientLeadRegistrationModal from './modal/ClientLeadRegistrationModal';
import SectionHeading from './SectionHeading';
import LawyerWarningModal from './modal/LawyerWarningModal';
import { checkValidity } from '@/helpers/validityCheck';
import Cookies from 'js-cookie';
import countries from '@/data/countries.json';
import { safeJsonParse } from '@/helpers/safeJsonParse';

export default function HomeCategoryWiseServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [service, setService] = useState(null);
  const [location, setLocation] = useState(null);

  //console.log('categories', allCategories?.data);
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));

  //console.log('country in home', cookieCountry);

  const { data: countryList } = useGetCountryListQuery();

  const defaultCountry = countryList?.data?.find(
    (country) => country?._id === cookieCountry?.countryId
  );

  const { data: allCategories, isLoading: isAllCategoriesLoading } =
    useGetAllCategoriesQuery(
      { countryId: defaultCountry?._id },
      { skip: !defaultCountry?._id }
    );

  const allServices =
    allCategories?.data?.flatMap((category) => category.services) || [];

  //console.log('defaultCountry', defaultCountry);

  useEffect(() => {
    if (!selectedService?._id) return;

    // Immediately clear previous questions to prevent flash
    setServiceWiseQuestions([]);
  }, [selectedService?._id]);

  // Default to Australia (AU) if available
  const { data: countryWiseServices, isLoading: isCountryWiseServicesLoading } =
    useGetCountryWiseServicesQuery(defaultCountry?._id, {
      skip: !defaultCountry?._id, // Skip
    });

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

  const validToken = checkValidity(token);

  const { data: currentUser } = useAuthUserInfoQuery(undefined, {
    skip: !validToken,
  });

  return (
    <section className="pt-[80px] category-wise-services pb-[100px]">
      <div className="container">
        <SectionHeading
          title="Explore a comprehensive range of specialized legal services tailored
            to your needs"
          subtitle="Our Services"
        />
        {/* <div className="section-heading">
          <h2 className="font-semibold">
            Explore a Comprehensive Range of Specialized Legal Services Tailored
            to Your Needs
          </h2>
          <p>The best services for you</p>
        </div> */}
        {allServices?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-[80px] mt-16">
            {allServices?.map((service, i) => (
              <Link
                key={service.id || i}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedService(service);
                  const currentUserType =
                    currentUser?.data?.regUserType.toLowerCase();

                  if (currentUserType === 'lawyer') {
                    setAuthModalOpen(true);
                    return;
                  }
                  handleModalOpen();
                }}
                className="category-wise-service-item flex flex-col gap-3 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
                  <img
                    src={
                      service?.serviceField?.thumbImage ||
                      '/assets/img/familylaw/divorce.webp'
                    }
                    alt={service?.name || 'Service'}
                    className="w-full h-full object-cover scale-100 hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="flex justify-between items-center px-3 pb-3">
                  <h5 className="text-sm font-medium text-gray-800 whitespace-nowrap overflow-hidden truncate pr-5">
                    {service?.name}
                  </h5>
                  <MoveRight className="text-[var(--primary-color)]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {validToken && currentUser ? (
        <>
          {currentUser?.data?.regUserType?.toLowerCase() === 'lawyer' &&
          authModalOpen ? (
            <LawyerWarningModal
              modalOpen={authModalOpen}
              setModalOpen={setAuthModalOpen}
            />
          ) : (
            <CreateLeadWithAuthModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              handleModalOpen={handleModalOpen}
              selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
              selectedService={selectedService}
              countryId={defaultCountry?._id}
              serviceId={selectedService?._id}
              locationId={location}
              isQuestionsLoading={isQuestionsLoading}
            />
          )}
        </>
      ) : (
        <ClientLeadRegistrationModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleModalOpen={handleModalOpen}
          selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
          selectedService={selectedService}
          countryId={defaultCountry?._id}
          serviceId={selectedService?._id}
        />
      )}
    </section>
  );
}
