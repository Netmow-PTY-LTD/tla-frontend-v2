import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CreateLeadWithAuthModal from '../../home/modal/CreateLeadWithAuthModal';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { useSelector } from 'react-redux';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import ClientLeadRegistrationModal from '../../home/modal/ClientLeadRegistrationModal';

const LawCard = ({ service }) => {
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

  console.log('modalOpen', modalOpen);

  return (
    <>
      <Link
        // href={`/services/${service?.slug}`}
        href="#"
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior
          setSelectedService(service);
          handleModalOpen();
        }}
      >
        <div className="law-card ">
          <figure className="relative h-[277px]">
            <Image
              alt={service?.name || 'Service'}
              src={service?.serviceField?.thumbImage}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              className="rounded-xl"
              style={{
                objectFit: 'cover', // cover, contain, none
              }}
            />
          </figure>
          <div className="card-body bg-[#EDF0F4] mt-2 rounded-xl p-3 sm:p-4 ">
            {/* <div className="flex justify-between items-center gap-2">
            <p className="text-[12px]">
              {' '}
              <span className="text-[#34495E] ">Case Listed:</span>{' '}
              <span className="font-semibold">
                {service?.caseListed ? service?.caseListed : 0}{' '}
              </span>
            </p>
            <p className="text-[12px]">
              {' '}
              <span className="text-[#34495E] ">Lawyer Available:</span>{' '}
              <span className="font-semibold">
                {service?.lawyerAvailable ? service?.lawyerAvailable : 0}{' '}
              </span>
            </p>
          </div> */}
            <h4 className="card-title font-medium leading-1 text-[16px]">
              {service?.name}{' '}
            </h4>
          </div>
        </div>
      </Link>
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
    </>
  );
};

export default LawCard;
