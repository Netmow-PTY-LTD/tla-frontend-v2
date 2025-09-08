'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOrRemoveServiceId,
  nextStep,
  updateNestedField,
} from '@/store/features/auth/lawyerRegistrationSlice';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { zodResolver } from '@hookform/resolvers/zod';
import { lawyerRegistrationStepOneFormValidation } from '@/schema/auth/lawyerRegistration.schema';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';

export default function RegisterStepOne() {
  const dispatch = useDispatch();

  const defaultName = useSelector(
    (state) => state.lawyerRegistration.profile.name
  );
  const selectedCountry = useSelector(
    (state) => state.lawyerRegistration.profile.country
  );

  const selectedServiceIds = useSelector(
    (state) => state.lawyerRegistration.lawyerServiceMap.services
  );

  const [inputValue, setInputValue] = useState('');
  const [hasServiceError, setHasServiceError] = useState(false);

  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));

  const { data: countryList } = useGetCountryListQuery();
  const defaultCountry = countryList?.data?.find(
    (country) => country._id === cookieCountry?.countryId
  );
  // Default to Australia (AU) if available
  const { data: countryWiseServices } = useGetCountryWiseServicesQuery(
    defaultCountry?._id,
    {
      skip: !defaultCountry?._id, // Skip
    }
  );

  useEffect(() => {
    if (!selectedCountry) {
      dispatch(
        updateNestedField({
          section: 'lawyerServiceMap',
          field: 'country',
          value: defaultCountry?._id || selectedCountry,
        })
      );
      dispatch(
        updateNestedField({
          section: 'profile',
          field: 'country',
          value: defaultCountry?._id || selectedCountry,
        })
      );
    }
  }, [selectedCountry, dispatch, defaultCountry?._id]);

  const form = useForm({
    resolver: zodResolver(lawyerRegistrationStepOneFormValidation),
    defaultValues: {
      name: defaultName || '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data) => {
    console.log('data', data);
    if (!selectedServiceIds.length) {
      setHasServiceError(true);
      return;
    }

    dispatch(
      updateNestedField({
        section: 'profile',
        field: 'name',
        value: data.name,
      })
    );

    dispatch(nextStep());
  };

  const handleSelectService = (id) => {
    setHasServiceError(false);
    dispatch(addOrRemoveServiceId(id));
  };

  const selectedServices = useMemo(() => {
    return (
      countryWiseServices?.data?.filter((s) =>
        selectedServiceIds.includes(s._id)
      ) || []
    );
  }, [selectedServiceIds, countryWiseServices]);

  const filteredServices = useMemo(() => {
    return (
      countryWiseServices?.data?.filter(
        (s) =>
          s.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedServiceIds.includes(s._id)
      ) || []
    );
  }, [inputValue, selectedServiceIds, countryWiseServices]);

  const topFiveServices = countryWiseServices?.data?.slice(0, 7) || [];

  // Add any selected services that are not in topFiveServices
  const uniquePopularServices = [
    ...topFiveServices,
    ...selectedServices.filter(
      (sel) => !topFiveServices.some((s) => s._id === sel._id)
    ),
  ];

  return (
    <div className="flex flex-wrap lg:flex-nowrap w-full">
      <div className="w-full">
        <div className="tla-auth-form tla-auth-form-register relative z-1">
          <div className="absolute inset-0 flex items-center justify-center z-[-1]">
            <div className="w-[215px] h-[215px] rounded-full bg-[#00C3C080] blur-[100px]"></div>
          </div>
          <h3 className="tla-auth-title mb-3 text-center">
            Expand your legal practice area
          </h3>
          <p className="tla-auth-subtitle mb-8 text-center">
            1000’s of local and remote clients are already waiting for your
            services
          </p>

          <h5 className="text-[var(--color-black)] text-[24px] uppercase text-center font-semibold mb-5">
            Register as Lawyer
          </h5>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="max-h-[400px] overflow-y-auto">
                <div className="flex flex-wrap space-y-5">
                  <div className="w-full">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="h-[44px] bg-[#F2F2F2] border-[#DCE2EA] focus-visible:ring-inset"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                dispatch(
                                  updateNestedField({
                                    section: 'profile',
                                    field: 'name',
                                    value: e.target.value,
                                  })
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>
                        What type of legal service do you provide?
                      </FormLabel>
                      <div className="space-y-1 relative">
                        <Input
                          placeholder="Type to search..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="tla-form-control focus-visible:ring-inset"
                          autoComplete="off"
                        />

                        <div className="flex flex-wrap gap-2">
                          {selectedServices.map((service) => (
                            <Badge
                              key={service._id}
                              className="cursor-pointer py-1 px-2 flex items-center gap-2 mt-1"
                              onClick={() => handleSelectService(service._id)}
                            >
                              {service.name} ✕
                            </Badge>
                          ))}
                        </div>

                        {inputValue && filteredServices.length > 0 && (
                          <div className="bg-white border rounded shadow max-h-48 overflow-y-auto p-2 absolute top-[41px] left-0 z-10 w-full">
                            {filteredServices.map((s) => (
                              <div
                                key={s._id}
                                className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  handleSelectService(s._id);
                                  setInputValue('');
                                }}
                              >
                                {s.name}
                              </div>
                            ))}
                          </div>
                        )}

                        {hasServiceError && (
                          <FormMessage>
                            At least one service must be selected.
                          </FormMessage>
                        )}
                      </div>
                    </FormItem>
                  </div>
                </div>

                {/* {selectedServices?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((service) => (
                    <div
                      key={service._id}
                      className="w-full sm:w-1/2 md:w-auto"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectService(service._id)}
                        className={`relative service-box flex gap-2 items-center w-full border border-1 border-[#DCE2EA] ${
                          selectedServiceIds.includes(service._id)
                            ? 'selected'
                            : ''
                        }`}
                      >
                        <Image
                          src={service.image || '/assets/img/no-image.jpg'}
                          width={30}
                          height={30}
                          className="object-cover rounded-full"
                          alt={service.name}
                        />
                        <span className="service-title text-[var(--color-black)] text-[13px]">
                          {service.name}
                        </span>
                        {selectedServiceIds.includes(service._id) && (
                          <span
                            className="text-sm text-white"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent click
                              handleSelectService(service._id); // Toggle off
                            }}
                          >
                            ✕
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )} */}

                <div
                  className={`popular-services mt-3 ${
                    hasServiceError
                      ? 'border border-red-500 p-4 rounded-md'
                      : ''
                  }`}
                >
                  <label className="font-medium text-[16px]">
                    Popular Services:
                  </label>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {uniquePopularServices?.map((service) => (
                      <div
                        key={service._id}
                        className="w-full sm:w-1/2 md:w-auto"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectService(service._id)}
                          className={`relative service-box flex gap-2 items-center w-full border border-1 border-[#DCE2EA] ${
                            selectedServiceIds.includes(service._id)
                              ? 'selected'
                              : ''
                          }`}
                        >
                          {/* <Image
                            src={service.image || '/assets/img/no-image.jpg'}
                            width={30}
                            height={30}
                            className="object-cover rounded-full w-6 h-6"
                            alt={service.name}
                          /> */}
                          <span className="service-title text-[var(--color-black)] text-[13px]">
                            {service.name}
                          </span>
                          {selectedServiceIds.includes(service._id) && (
                            <span
                              className="text-sm text-white"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent parent click
                                handleSelectService(service._id); // Toggle off
                              }}
                            >
                              ✕
                            </span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-auth-register mt-8">
                Get Started
              </button>
            </form>
          </Form>

          <div className="tla-auth-footer text-center">
            <span>Already have an account? </span>
            <Link href="/login">
              <b>Log In</b>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="hidden lg:block lg:max-w-[31.25rem] overflow-hidden">
        <Image
          src="/assets/img/register.webp"
          width={500}
          height={627}
          alt="Auth"
          className="h-full object-cover rounded-tl-0 rounded-tr-[1.25rem] rounded-br-[1.125rem] rounded-bl-0"
        />
      </div> */}
    </div>
  );
}
