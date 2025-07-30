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

export default function HomeCategoryWiseServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [service, setService] = useState(null);
  const [location, setLocation] = useState(null);

  const { data: allCategories } = useGetAllCategoriesQuery();

  //console.log('categories', allCategories?.data);
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
        <div className="section-heading">
          <h2 className="font-medium">Explore</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 mt-20">
          {allCategories?.data?.length > 0 &&
            allCategories?.data?.map((category, i) => (
              <Link
                key={i}
                href="#"
                className="category-wise-service-item flex flex-col items-center text-center gap-3 capitalize"
                onClick={(e) => e.preventDefault()}
              >
                <div className="icon w-16 h-16 border border-gray-200 rounded flex items-center justify-center p-2">
                  <img
                    src={category?.image}
                    alt={category.name}
                    className="w-full h-full"
                  />
                </div>
                <h5>{category.name}</h5>
              </Link>
            ))}
          {allCategories?.data?.length > 0 && (
            <Link
              href="/services"
              className="category-wise-service-item flex flex-col items-center text-center gap-3"
            >
              <div className="icon w-16 h-16 border border-gray-200 rounded flex items-center justify-center">
                <Ellipsis className="text-gray-400" />
              </div>
              <h5>More Laws</h5>
            </Link>
          )}
        </div>
        <div className="space-y-10 mt-20">
          {allCategories?.data?.length > 0 &&
            allCategories?.data?.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold">{category?.name}</h4>
                  <Link
                    href={`/services/${category?.slug}`}
                    className="text-[#444] text-sm hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category?.services?.map((service, i) => (
                    <Link
                      key={i}
                      // href={`/services/${service.id}`}
                      href={`#`}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        setSelectedService(service);
                        handleModalOpen();
                      }}
                      className="category-wise-service-item flex flex-col gap-3 border border-gray-200 rounded-lg"
                    >
                      <div className="icon w-full h-[200px]">
                        <img
                          src={
                            service?.serviceField?.thumbImage ||
                            '/assets/img/familylaw/divorce.webp'
                          }
                          alt={service?.name}
                          className="rounded-t-lg w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between px-3 pb-2">
                        <h5 className="text-sm">{service?.name}</h5>
                        <MoveRight className="text-[var(--primary-color)]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
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
