'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGetAllMyLeadsQuery } from '@/store/features/lawyer/LeadsApiService';
import {
    useGetCountryListQuery,
    useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import {
    useGetCountryWiseServicesQuery,
    useGetServiceGroupsQuery,
} from '@/store/features/admin/servicesApiService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Loader, PlusCircle, Briefcase, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
// import { useGetAllCategoriesQuery } from '@/store/features/public/catagorywiseServiceApiService';
import Cookies from 'js-cookie';
import { safeJsonParse } from '@/helpers/safeJsonParse';

export default function AddNewCase() {
    const [selectedService, setSelectedService] = useState(null);
    const [serviceWiseQuestions, setServiceWiseQuestions] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [service, setService] = useState(null);
    const [query, setQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [leads, setLeads] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [totalLeadsCount, setTotalLeadsCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const scrollContainerRef = useRef(null);

    const {
        data: allMyLeads,
        isLoading: isAllMyLeadsLoading,
        // isFetching,
    } = useGetAllMyLeadsQuery(
        { page, limit: 10 },
        { keepPreviousData: true, refetchOnMountOrArgChange: true }
    );

    const router = useRouter();
    const cookieCountry = safeJsonParse(Cookies.get('countryObj'));

    const { data: countryList } = useGetCountryListQuery();

    const defaultCountry = countryList?.data?.find(
        (country) => country?._id === cookieCountry?.countryId
    );

    const { data: serviceGroupsData, isLoading: isServiceGroupsLoading } =
        useGetServiceGroupsQuery(defaultCountry?._id, {
            skip: !defaultCountry?._id,
        });
    const allServices = serviceGroupsData?.data?.services || [];

    const { data: countryWiseServices } = useGetCountryWiseServicesQuery(
        defaultCountry?._id,
        {
            skip: !defaultCountry?._id, // Skip
        }
    );

    const filteredServices =
        query === ''
            ? allServices
            : allServices.filter((s) =>
                s.name.toLowerCase().replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            );

    const token = useSelector((state) => state.auth.token);

    const { data: currentUser } = useAuthUserInfoQuery(undefined, {
        skip: !token,
    });

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    useEffect(() => {
        if (!selectedService?._id) return;
        setServiceWiseQuestions(null);
    }, [selectedService?._id]);

    const {
        data: singleServicewiseQuestionsData,
        isLoading: isQuestionsLoading,
        isFetching,
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
        if (isQuestionsLoading || isFetching) return;
        setServiceWiseQuestions(singleServicewiseQuestionsData?.data || []);
    }, [isQuestionsLoading, isFetching, singleServicewiseQuestionsData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!service && !query) {
            showErrorToast('Please select a service.');
            return;
        }

        let serviceToSelect = service;
        if (!serviceToSelect && query) {
            // Robust search for "Others" in available service lists
            const findOthers = (list) =>
                list?.find(
                    (s) => s.slug === 'others' || s.name.toLowerCase() === 'others'
                );

            serviceToSelect = findOthers(allServices);
        }

        if (!serviceToSelect || !serviceToSelect?._id) {
            showErrorToast('Please select a service.');
            return;
        }

        setSelectedService(serviceToSelect);
        setModalOpen(true);
    };

    if (isAllMyLeadsLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-8 animate-pulse">
                <div className="space-y-3 pb-8 border-b">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
                    <Skeleton className="h-6 w-1/4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-12 flex-1 rounded-lg" />
                        <Skeleton className="h-12 w-40 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-100px)] lg:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                        <PlusCircle className="w-8 h-8 text-[#00C3C0]" />
                        Add New Case
                    </h1>
                    <p className="md:text-md text-gray-600 max-w-2xl">
                        Select the legal service you need and provide a few details to get started. Our system will match you with the best available lawyers.
                    </p>
                </div>

                {/* Main Card */}
                <Card className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border-none">
                    <div className="space-y-6">
                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">How it works</p>
                                <p>Once you suggest a service, we'll ask a few questions to better understand your case. This helps us find the most qualified legal professionals for you.</p>
                            </div>
                        </div>

                        {/* Search Section */}
                        <div className="space-y-4">
                            <h3 className="md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-gray-400" />
                                What type of legal service do you need?
                            </h3>

                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Combobox value={service} onChange={(val) => {
                                            setService(val);
                                            if (val) {
                                                setQuery('');
                                            }
                                        }}>
                                            <div className="relative group">
                                                <ComboboxInput
                                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#00C3C0] focus:ring-2 focus:ring-[#00C3C0]/10 rounded-xl h-[48px] md:h-[56px] px-6 text-[16px] transition-all duration-200 outline-none"
                                                    onChange={(e) => {
                                                        setQuery(e.target.value);
                                                        setService(null);
                                                    }}
                                                    displayValue={(val) => val?.name || query}
                                                    placeholder="e.g. Family Law, Criminal Defense, Property Law..."
                                                    autoComplete="off"
                                                />
                                                {(filteredServices?.length === 0 && query !== '') ? (
                                                    <ComboboxOptions className="absolute z-50 mt-2 w-full rounded-xl bg-white p-4 text-sm shadow-xl ring-1 ring-black/5 text-gray-500 text-center">
                                                        No results found.
                                                    </ComboboxOptions>
                                                ) : filteredServices?.length > 0 && (
                                                    <ComboboxOptions className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl bg-white p-2 text-sm shadow-xl ring-1 ring-black/5 focus:outline-none">
                                                        {filteredServices?.map((item) => (
                                                            <ComboboxOption
                                                                key={item._id}
                                                                value={item}
                                                                className={({ active }) =>
                                                                    cn(
                                                                        'cursor-pointer select-none relative py-1.5 px-4 rounded-lg mb-1',
                                                                        active
                                                                            ? 'bg-[#00C3C0]/10 text-[#008A88]'
                                                                            : 'text-gray-900 hover:bg-gray-50'
                                                                    )
                                                                }
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span
                                                                            className={cn('block truncate font-medium', {
                                                                                'text-[#00C3C0]': selected,
                                                                            })}
                                                                        >
                                                                            {item.name}
                                                                        </span>
                                                                        {selected && (
                                                                            <span className="absolute inset-y-0 left-2 flex items-center text-[#00C3C0]">
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
                                    <Button
                                        type="submit"
                                        className="bg-[#00C3C0] hover:bg-[#00B0AE] text-white font-bold px-8 h-[48px] md:h-[56px] rounded-xl shadow-lg shadow-[#00C3C0]/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Request A New Case
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Popular Categories (Optional addition for better UX) */}
                        {allServices?.length > 0 && (
                            <div className="pt-2">
                                <p className="text-sm font-medium text-gray-500 mb-3">Popular Services:</p>
                                <div className="flex flex-wrap gap-2">
                                    {allServices.map((s) => (
                                        <button
                                            key={s._id}
                                            onClick={() => {
                                                setService(s);
                                                setSelectedService(s);
                                                setModalOpen(true);
                                            }}
                                            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm border border-gray-100 rounded-full transition-colors duration-200"
                                        >
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
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
                isQuestionsLoading={isQuestionsLoading || isFetching || serviceWiseQuestions === null}
                customService={query}
            />
        </div>
    )
}