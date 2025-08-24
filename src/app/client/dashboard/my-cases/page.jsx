'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import {
  useGetCountryListQuery,
  useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import {
  useGetAllCountryWiseServicesQuery,
  useGetCountryWiseServicesQuery,
} from '@/store/features/admin/servicesApiService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ClientLeadCard from '../../_components/ClientLeadCard';
import ClientNewLeadRegistrationModal from '../../_components/ClientNewLeadRegistrationModal';
import JobRequest from '../../_components/JobRequest';
import { Check, Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import { cn } from '@/lib/utils';
import CreateLeadWithAuthModal from '@/components/main/home/modal/CreateLeadWithAuthModal';
import { useSelector } from 'react-redux';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { showErrorToast } from '@/components/common/toasts';
import { useGetAllCategoriesQuery } from '@/store/features/public/catagorywiseServiceApiService';
import Cookies from 'js-cookie';

export default function MyLeads() {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [service, setService] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [leads, setLeads] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);

  const {
    data: allMyLeads,
    isLoading: isAllMyLeadsLoading,
    isFetching,
  } = useGetAllMyLeadsQuery(
    { page, limit: 10 },
    { keepPreviousData: true, refetchOnMountOrArgChange: true }
  );

  //console.log('allMyLeads', allMyLeads);

  const router = useRouter();

  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (redirect !== 'false' && allMyLeads?.data?.length === 1) {
      router.push(`/client/dashboard/my-cases/${allMyLeads.data[0]?._id}`);
    }
  }, [allMyLeads, redirect]);

  useEffect(() => {
    const cookieCountry = JSON.parse(Cookies.get('countryObj'));
    setSelectedCountry(cookieCountry);
  }, []);

  console.log('selectedCountry', selectedCountry);

  const { data: countryList } = useGetCountryListQuery();

  const defaultCountry = countryList?.data?.find(
    (country) => country?._id === selectedCountry?.countryId
  );

  console.log('defaultCountry in my cases', defaultCountry);

  const { data: allCategories } = useGetAllCategoriesQuery();

  const allServices =
    allCategories?.data?.flatMap((category) => category.services) || [];

  // Default to Australia (AU) if available
  const { data: countryWiseServices } = useGetCountryWiseServicesQuery(
    defaultCountry?._id,
    {
      skip: !defaultCountry?._id, // Skip
    }
  );

  useEffect(() => {
    if (!allMyLeads) return;

    setLeads((prev) => {
      const updatedLeads =
        page === 1 ? allMyLeads?.data : [...prev, ...allMyLeads?.data];

      return updatedLeads;
    });

    const totalPage = allMyLeads?.pagination?.totalPage;

    if (
      !Array.isArray(allMyLeads?.data) ||
      allMyLeads?.data?.length === 0 ||
      typeof totalPage !== 'number' ||
      totalPage <= 0 ||
      page >= totalPage
    ) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [allMyLeads?.data, page]);

  // Scroll event handler for infinite loading
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (nearBottom && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isFetching, scrollContainerRef?.current]);

  const token = useSelector((state) => state.auth.token);

  const { data: currentUser } = useAuthUserInfoQuery(undefined, {
    skip: !token,
  });

  const handleModalOpen = () => {
    //setServiceWiseQuestions(null); // Reset serviceWiseQuestions when opening the modal
    setModalOpen(true);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setSelectedService(service);
    if (!service || !service?._id) {
      showErrorToast('Please select a service and location.');
      return;
    }
    setModalOpen(true);
  };

  if (isAllMyLeadsLoading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        {/* Header section */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Content blocks */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Avatar skeleton */}
            <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
            {/* Text block */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}

        {/* Table or card-like block */}
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-1/3" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">My Cases</h2>
          <form className="w-full md:w-1/2" onSubmit={handleSubmit}>
            <div className="hero-search-area flex flex-wrap md:flex-nowrap gap-2 items-center w-full justify-end">
              <div className="tla-form-group w-full lg:w-1/2">
                <Combobox value={service} onChange={(val) => setService(val)}>
                  <div className="relative">
                    <ComboboxInput
                      className="border border-gray-300 rounded-md w-full h-[44px] px-4 text-[14px]"
                      onChange={(e) => {
                        setService(e.target.value);
                      }}
                      displayValue={(val) => val?.name || ''}
                      placeholder="Search a service..."
                      autoComplete="off"
                    />
                    {allServices?.length > 0 && (
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {allServices?.map((item) => (
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
              <Button className="text-white py-[10px] px-[20px] rounded-[5px] bg-[#00C3C0] h-[44px]">
                Request a new case
              </Button>
            </div>
          </form>
        </div>
        <div
          className="max-h-[calc(100vh-170px)] overflow-y-auto"
          ref={scrollContainerRef}
        >
          <div className="mt-5 max-w-[1400px] mx-auto">
            {leads?.length === 0 && (
              <JobRequest modalOpen={modalOpen} setModalOpen={setModalOpen} />
            )}

            {leads?.length > 0 && (
              <>
                {/* <div className="flex justify-between items-center my-5">
              <FilterDropdown />
              <button className="bg-green-700 p-[10px] flex items-center gap-2 text-white rounded-lg">
                <CircleX className="w-4 h-4" /> <span>Approve</span>
              </button>
            </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 mt-5 pr-2">
                  {leads?.map((lead, index) => (
                    // <JobPostCard key={index} lead={lead} />
                    <ClientLeadCard key={index} user={lead} />
                  ))}
                  {hasMore && (
                    <div className="py-6 text-center">
                      <Loader className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <CreateLeadWithAuthModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={() => setModalOpen(false)}
        selectedServiceWiseQuestions={serviceWiseQuestions ?? []}
        selectedService={selectedService}
        countryId={defaultCountry?._id}
        defaultCountry={defaultCountry}
        serviceId={selectedService?._id}
        isQuestionsLoading={isQuestionsLoading}
      />
    </>
  );
}
