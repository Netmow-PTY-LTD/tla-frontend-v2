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

export default function RegisterStepOneTest() {
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

  const { data: countryWiseServices } = useGetCountryWiseServicesQuery(
    selectedCountry || '682ecd01e6b730f229c8d3d3'
  );

  useEffect(() => {
    if (selectedCountry) {
      dispatch(
        updateNestedField({
          section: 'lawyerServiceMap',
          field: 'country',
          value: '682ecd01e6b730f229c8d3d3',
        })
      );
    }
  }, [selectedCountry, dispatch]);

  const form = useForm({
    defaultValues: {
      name: defaultName || '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data) => {
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

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center">
      <div className="hidden lg:block lg:max-w-[602px]">
        <Image
          src="/assets/img/auth-step1.png"
          width={602}
          height={751}
          alt="Auth"
        />
      </div>

      <div className="w-full lg:w-7/12">
        <div className="tla-auth-form tla-auth-form-register">
          <h2 className="tla-auth-title mb-2">
            Expand your legal practice area
          </h2>
          <p className="tla-auth-subtitle mb-5">
            1000’s of local and remote clients are already waiting for your
            services
          </p>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="tla-form-control"
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

              <FormItem>
                <FormLabel>
                  What type of legal service do you provide?
                </FormLabel>
                <div className="space-y-2">
                  <Input
                    placeholder="Type to search..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="tla-form-control"
                    autoComplete="off"
                  />

                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((service) => (
                      <Badge
                        key={service._id}
                        className="cursor-pointer"
                        onClick={() => handleSelectService(service._id)}
                      >
                        {service.name} ✕
                      </Badge>
                    ))}
                  </div>

                  {inputValue && filteredServices.length > 0 && (
                    <div className="bg-white border rounded shadow max-h-40 overflow-y-auto p-2">
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

              <div
                className={`popular-services mb-8 ${
                  hasServiceError ? 'border border-red-500 p-4 rounded-md' : ''
                }`}
              >
                <h4>Popular Law Services</h4>
                <div className="flex flex-wrap gap-2 mt-4">
                  {countryWiseServices?.data?.slice(0, 9).map((service) => (
                    <div key={service._id} className="w-full sm:w-1/2 md:w-1/4">
                      <button
                        type="button"
                        onClick={() => handleSelectService(service._id)}
                        className={`service-box flex gap-2 items-center w-full ${
                          selectedServiceIds.includes(service._id)
                            ? 'selected'
                            : ''
                        }`}
                      >
                        <Image
                          src={service.image || '/assets/img/no-image.jpg'}
                          width={50}
                          height={50}
                          className="object-cover rounded-md"
                          alt={service.name}
                        />
                        <h5 className="service-title">{service.name}</h5>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-auth-register">
                Get Started
              </button>
            </form>
          </Form>

          <div className="tla-auth-footer">
            <span>Already have an account? </span>
            <Link href="/login">
              <b>Log In</b>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
