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

export default function HomeCategoryWiseServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [service, setService] = useState(null);
  const [location, setLocation] = useState(null);

  const { data: allCategories } = useGetAllCategoriesQuery();

  const allServices =
    allCategories?.data?.flatMap((category) => category.services) || [];

  //console.log('categories', allCategories?.data);
  const handleModalOpen = () => {
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
    <section className="section category-wise-services">
      <div className="container">
        <SectionHeading
          title="Explore a Comprehensive Range of Specialized Legal Services Tailored
            to Your Needs"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-16">
            {allServices?.map((service, i) => (
              <Link
                key={service.id || i}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedService(service);
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
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center px-3 pb-3">
                  <h5 className="text-sm font-medium text-gray-800">
                    {service?.name}
                  </h5>
                  <MoveRight className="text-[var(--primary-color)]" />
                </div>
              </Link>
            ))}
          </div>
        )}
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
