import React, { useEffect, useState } from 'react';
import styles from './carousel.module.css';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import CreateLeadWithAuthModal from '../home/modal/CreateLeadWithAuthModal';
import ClientLeadRegistrationModal from '../home/modal/ClientLeadRegistrationModal';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';

const slidesData = [
  {
    image: '/assets/img/services/service-slider-1.webp',
    caption: 'Family Law',
  },
  {
    image: '/assets/img/services/service-slider-2.webp',
    caption: 'Property Law',
  },
  {
    image: '/assets/img/services/service-slider-3.webp',
    caption: 'Traffic Law',
  },
  {
    image: '/assets/img/services/service-slider-4.webp',
    caption: 'Administrative Law',
  },
  {
    image: '/assets/img/services/service-slider-5.webp',
    caption: 'Criminal Law',
  },
];

export default function HeroSlider() {
  const [modalOpen, setModalOpen] = useState(false);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [current, setCurrent] = useState(0);

  const updateSlides = (index) => {
    setCurrent(index);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const getSlideClass = (index) => {
    const total = slidesData.length;
    if (index === current) return styles.active;
    if (index === (current - 1 + total) % total) return styles.prev;
    if (index === (current + 1) % total) return styles.next;
    return '';
  };

  // 🔁 Autoplay effect
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // 5000ms = 5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, [current]);

  const handleModalOpen = () => {
    //setServiceWiseQuestions(null); // Reset serviceWiseQuestions when opening the modal
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

  useEffect(() => {
    if (!selectedService?._id) return;

    // Immediately clear previous questions to prevent flash
    setServiceWiseQuestions([]);
  }, [selectedService?._id]);

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
    if (isQuestionsLoading) return; // ✅ Wait for loading to complete
    setServiceWiseQuestions(singleServicewiseQuestionsData?.data || []);
  }, [isQuestionsLoading, singleServicewiseQuestionsData]);

  const token = useSelector((state) => state.auth.token);

  const { data: currentUser } = useAuthUserInfoQuery(undefined, {
    skip: !token,
  });

  return (
    <>
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselContainer}>
          {isCountryWiseServicesLoading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            countryWiseServices?.data?.length > 0 &&
            countryWiseServices?.data?.slice(0, 5).map((service, index) => {
              const image =
                slidesData[index % slidesData.length]?.image ||
                '/assets/img/services/service-slider-1.webp';

              return (
                <div
                  key={index}
                  className={`${styles.carouselSlide} ${getSlideClass(
                    index
                  )} cursor-pointer`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    setSelectedService(service);
                    handleModalOpen();
                  }}
                >
                  <img src={image} alt={service?.name} />
                  <div className={styles.caption}>{service?.name}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Controls Wrapper */}
        <div className={styles.controlsWrapper}>
          <button
            className={`${styles.carouselButton} ${styles.prev}`}
            onClick={prevSlide}
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>

          <div className={styles.sliderDots}>
            {slidesData.map((_, index) => (
              <span
                key={index}
                className={`${styles.sliderDot} ${
                  index === current ? styles.activeDot : ''
                }`}
                onClick={() => updateSlides(index)}
              />
            ))}
          </div>

          <button
            className={`${styles.carouselButton} ${styles.next}`}
            onClick={nextSlide}
          >
            <ArrowRight className="w-5 h-5 text-gray-500" />
          </button>
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
          isQuestionsLoading={isQuestionsLoading}
        />
      ) : (
        <ClientLeadRegistrationModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          handleModalOpen={handleModalOpen}
          selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
          countryId={defaultCountry?._id}
          serviceId={selectedService?._id}
          locationId={location}
          isQuestionsLoading={isQuestionsLoading}
        />
      )}
    </>
  );
}
