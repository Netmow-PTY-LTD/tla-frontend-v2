import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { popularServices } from '@/data/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function RegisterStepOne({
  handleStep,
  setFullName,
  fullName,
  selectedService,
  setSelectedService,
  selectedServiceId,
  setSelectedServiceId,
  selectedServiceIds,
  setSelectedServiceIds,
  countrywiseServices,
  selectedServiceNames,
  setSelectedServiceNames,
  hasServiceError,
  setHasServiceError,
}) {
  const handleServiceClick = (id, name) => {
    setSelectedServiceIds((prevSelected) => {
      setHasServiceError(false);
      let newSelected;
      if (prevSelected.includes(id)) {
        newSelected = prevSelected.filter((item) => item !== id);
      } else {
        newSelected = [...prevSelected, id];
      }

      // Update names accordingly
      const updatedNames = countrywiseServices?.data
        .filter((s) => newSelected.includes(s._id))
        .map((s) => s.name)
        .join(', ');

      setSelectedServiceNames(updatedNames);
      return newSelected;
    });
  };

  const formSchema = z.object({
    fullName: z.string().min(2, {
      message: 'Name is required and must be at least 2 characters.',
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: fullName || '',
      service: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap items-center">
        <div className="hidden lg:block lg:max-w-[602]">
          <div className="tla-auth-image">
            <Image
              src="/assets/img/auth-step1.png"
              width={602}
              height={751}
              alt="Auth Image"
            />
          </div>
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="tla-form-control"
                          value={fullName}
                          onChange={(e) => {
                            field.onChange(e);
                            setFullName(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{' '}
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What type of legal service you provide?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Divorce Law"
                          {...field}
                          className="tla-form-control"
                          value={selectedServiceNames}
                          readonly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className={`popular-services mb-8 ${
                    hasServiceError
                      ? 'border border-red-500 p-4 rounded-md'
                      : ''
                  }`}
                >
                  <h4>Popular Law Services</h4>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {countrywiseServices?.data?.map((service) => (
                      <div
                        className="w-full sm:w-1/2 md:w-1/4"
                        key={service.id}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleServiceClick(service._id, service.name)
                          }
                          className={`service-box flex gap-2 items-center w-full ${
                            selectedServiceIds.includes(service._id)
                              ? 'selected'
                              : ''
                          }`}
                        >
                          <Image
                            src={
                              service.image
                                ? service.image
                                : '/assets/img/no-image.jpg'
                            }
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
                <button
                  type="submit"
                  className="btn-auth-register"
                  onClick={form.handleSubmit(handleStep)} // <-- call handleStep only if form valid
                >
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
    </>
  );
}
