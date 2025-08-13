'use client';

import Link from 'next/link';
import React, { use, useEffect, useRef, useState } from 'react';
import HeroShowcase from './HeroShowcase';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import {
  useGetCountryListQuery,
  useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import ClientLeadRegistrationModal from './modal/ClientLeadRegistrationModal';
import { useSelector } from 'react-redux';
import CreateLeadWithAuthModal from './modal/CreateLeadWithAuthModal';
import { Check, ChevronDown, Loader } from 'lucide-react';
import HeroSlider from '../common/HeroSlider';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { showErrorToast } from '@/components/common/toasts';
export default function HeroHome({ searchParam }) {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [service, setService] = useState(null);
  const [location, setLocation] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredZipCodes, setFilteredZipCodes] = useState([]);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    if (searchParam === 'true') {
      inputRef.current.focus();
    }
  }, [searchParam]);

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

  const { data: allZipCodes, isLoading: isZipCodeLoading } =
    useGetZipCodeListQuery();

  // const filteredZipCodes = allZipCodes?.data?.filter((item) =>
  //   item?.zipcode?.toLowerCase().includes(location?.toLowerCase())
  // );

  //const zipInputRef = useRef(null);

  // useEffect(() => {
  //   let autoCompleteInstance;

  //   const initializeAutoComplete = () => {
  //     autoCompleteInstance = new google.maps.places.Autocomplete(
  //       zipInputRef.current,
  //       {
  //         fields: ['geometry', 'formatted_address', 'address_components'],
  //       }
  //     );

  //     // Limit results to Australia
  //     autoCompleteInstance.setComponentRestrictions({ country: ['au'] });

  //     autoCompleteInstance.addListener('place_changed', () => {
  //       const selectedPlace = autoCompleteInstance.getPlace();
  //       if (!selectedPlace.geometry) return;

  //       const zipComponent = selectedPlace.address_components.find((item) =>
  //         item.types.includes('postal_code')
  //       );
  //       const postalCode = zipComponent ? zipComponent.long_name : '';

  //       if (!postalCode) return;

  //       // Example: You can update your form here
  //       // updateField('zip', postalCode);
  //       // updateField('fullAddress', selectedPlace.formatted_address);
  //       setLocation(selectedPlace.formatted_address);
  //     });
  //   };

  //   if (typeof window !== 'undefined') {
  //     if (window.google && window.google.maps?.places) {
  //       initializeAutoComplete();
  //     } else {
  //       window.initMap = initializeAutoComplete;
  //     }
  //   }
  // }, []);

  // Handle direct changes to the address
  // useEffect(() => {
  //   const retrieveGeoData = async () => {
  //     if (!location) return;

  //     try {
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //           location
  //         )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  //       );
  //       const geoData = await response.json();

  //       if (geoData.status === 'OK') {
  //         const locationData = geoData.results[0];
  //         const geoLocation = locationData.geometry.location;

  //         const readableAddress = locationData.formatted_address;

  //         const zipComponent = locationData.address_components.find((comp) =>
  //           comp.types.includes('postal_code')
  //         );
  //         const postalCode = zipComponent ? zipComponent.long_name : '';

  //         // You can store lat/lng, zip etc. if needed
  //         // updateLatLng(geoLocation.lat, geoLocation.lng);
  //         // updateZip(postalCode);

  //         // Ensure address remains consistent
  //         setLocation(readableAddress);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching location info', error);
  //     }
  //   };

  //   retrieveGeoData();
  // }, [location]);

  // console.log('selectedService', selectedService);
  // console.log('location', location);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSelectedService(service);
    if (!service || !service?._id) {
      showErrorToast('Please select a service.');
      return;
    }
    setModalOpen(true);
  };

  return (
    <section className="hero-home section">
      <div className="container">
        <div className="hero-content py-[50px]">
          {/* <h3>Get a quote for legal services.</h3> */}
          <div className="mb-[30px]">
            <h1 className="mb-[15px]">Need a Lawyer?</h1>
            <p className="text-[#444] text-2xl font-medium">
              Get free quotes in minutes.
            </p>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="hero-search-area flex flex-wrap md:flex-nowrap gap-2 items-center w-full">
              <div className="tla-form-group w-full lg:w-10/12">
                <Combobox value={service} onChange={(val) => setService(val)}>
                  <div className="relative">
                    <ComboboxInput
                      className="border border-gray-300 rounded-md w-full h-[44px] px-4 tla-form-control"
                      onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        const matched = countryWiseServices?.data?.filter((s) =>
                          s.name.toLowerCase().includes(query)
                        );
                        setFilteredServices(
                          query ? matched : countryWiseServices?.data
                        );
                        setService(e.target.value);
                        console.log('service', e.target.value);
                      }}
                      displayValue={(val) => val?.name || ''}
                      placeholder="What area of law are you interested in?"
                      onFocus={() =>
                        setFilteredServices(countryWiseServices?.data ?? [])
                      }
                      ref={inputRef}
                    />
                    {filteredServices?.length > 0 && (
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {filteredServices.map((item) => (
                          <ComboboxOption
                            key={item._id}
                            value={item}
                            className={({ active }) =>
                              cn(
                                'cursor-pointer select-none relative py-2 px-6',
                                active
                                  ? 'bg-blue-100 text-black'
                                  : 'text-gray-900'
                              )
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={cn('block truncate', {
                                    'font-medium': selected,
                                    'font-normal': !selected,
                                  })}
                                >
                                  {item.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <Check className="h-4 w-4" />
                                  </span>
                                )}
                              </>
                            )}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </div>
                </Combobox>
              </div>
              {/* <div className="tla-form-group w-full lg:w-5/12">
                <input
                  ref={zipInputRef}
                  type="text"
                  className="tla-form-control"
                  placeholder="Location"
                  autoComplete="off"
                  value={location} // ✅ controlled input for full address
                  onChange={(e) => console.log(e.target.value)} // updates address while typing
                />
              </div> */}
              <div className="tla-btn-wrapper w-full lg:w-1/6">
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
                  className="flex flex-wrap justify-center items-center gap-[10px] text-center  border py-1 px-3 rounded-full"
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
    </section>
  );
}
