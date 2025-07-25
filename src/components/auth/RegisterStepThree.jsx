'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateField,
  updateNestedField,
  prevStep,
} from '@/store/features/auth/lawyerRegistrationSlice';
import { useAuthRegisterMutation } from '@/store/features/auth/authApiService';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '../common/toasts';
import { verifyToken } from '@/utils/verifyToken';
import { setUser } from '@/store/features/auth/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { lawyerRegistrationStepThreeFormValidation } from '@/schema/auth/lawyerRegistration.schema';
import Link from 'next/link';

export default function RegisterStepThree() {
  const dispatch = useDispatch();
  const registration = useSelector((state) => state.lawyerRegistration);
  const { email, password, profile } = registration;
  const { companyTeam, companyName, website, companySize } =
    registration.companyInfo;

  const [localCompanySize, setLocalCompanySize] = useState(companySize || '');
  const [isCompany, setIsCompany] = useState(companyTeam || false);

  const form = useForm({
    resolver: zodResolver(lawyerRegistrationStepThreeFormValidation),
    defaultValues: {
      email,
      phone: profile?.phone,
      soloPractitioner: registration.lawyerServiceMap.isSoloPractitioner,
      companyTeam,
      company_name: companyName,
      company_website: website,
      company_size: companySize,
      password,
    },
  });

  useEffect(() => {
    // Sync redux data to local form
    form.reset({
      email,
      phone: profile?.phone,
      password,
      soloPractitioner: registration.lawyerServiceMap.isSoloPractitioner,
      companyTeam,
      company_name: companyName,
      company_website: website,
      company_size: companySize,
    });
  }, [
    email,
    profile?.phone,
    password,
    companyTeam,
    companyName,
    website,
    companySize,
  ]);

  const router = useRouter();
  const registrationState = useSelector((state) => state.lawyerRegistration);
  const [authRegister, { isLoading }] = useAuthRegisterMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await authRegister(registrationState).unwrap();

      if (result?.success && result?.token) {
        showSuccessToast(result?.message || 'Registration successful');
        const token = result.token;
        const userPayload = verifyToken(token);

        if (userPayload) {
          dispatch(setUser({ user: result?.data, token }));

          const userType = result?.data?.regUserType;
          if (userType === 'lawyer') router.push('/lawyer/dashboard');
          else if (userType === 'client') router.push('/client/dashboard');
          else router.push('/');
        }
      } else {
        const errorMessage =
          result?.errorSources?.[0]?.message ||
          result?.message ||
          'Registration failed.';
        console.log('Registration error:', result);
        showErrorToast(errorMessage || 'Something went wrong');
      }
    } catch (error) {
      console.log('Registration error:', error);
      console.error('❌ Registration API Error:', error);
      showErrorToast(error?.data?.message || 'Server error');
    }
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap">
      <div className="w-full">
        <div className="tla-auth-form tla-auth-form-register relative">
          <div className="absolute inset-0 flex items-center justify-center z-[-1]">
            <div className="w-[215px] h-[215px] rounded-full bg-[#00C3C080] blur-[100px]"></div>
          </div>
          <h3 className="tla-auth-title mb-2 text-center">
            Some details about you
          </h3>
          <p className="tla-auth-subtitle mb-5 text-center">
            You’re just a few steps away from viewing our Family Law leads
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Email & Phone */}
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 md:pr-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johndoe@gmail.com"
                            {...field}
                            className="tla-form-control"
                            onChange={(e) => {
                              field.onChange(e);
                              dispatch(
                                updateField({
                                  field: 'email',
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
                <div className="w-full md:w-1/2 md:pl-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            {...field}
                            className="tla-form-control"
                            onChange={(e) => {
                              field.onChange(e);
                              dispatch(
                                updateField({
                                  field: 'password',
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
              </div>

              <div className="flex flex-wrap">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone number"
                            {...field}
                            className="tla-form-control"
                            onChange={(e) => {
                              field.onChange(e);
                              dispatch(
                                updateNestedField({
                                  section: 'profile',
                                  field: 'phone',
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
              </div>

              {/* Solo Practitioner */}
              <FormField
                control={form.control}
                name="soloPractitioner"
                render={({ field }) => (
                  <FormItem className="flex items-center cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          dispatch(
                            updateNestedField({
                              section: 'lawyerServiceMap',
                              field: 'isSoloPractitioner',
                              value: checked,
                            })
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel
                      className="ml-2 font-bold mt-0 cursor-pointer"
                      style={{ marginTop: '0 !important' }}
                    >
                      I will work as solo practitioner
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Company/Team Checkbox */}
              <FormField
                control={form.control}
                name="companyTeam"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setIsCompany(checked);
                          dispatch(
                            updateNestedField({
                              section: 'companyInfo',
                              field: 'companyTeam',
                              value: checked,
                            })
                          );

                          if (!checked) {
                            dispatch(
                              updateNestedField({
                                section: 'companyInfo',
                                field: 'companyName',
                                value: '',
                              })
                            );
                            dispatch(
                              updateNestedField({
                                section: 'companyInfo',
                                field: 'website',
                                value: '',
                              })
                            );
                            dispatch(
                              updateNestedField({
                                section: 'companyInfo',
                                field: 'companySize',
                                value: '',
                              })
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="ml-2 font-bold cursor-pointer">
                      I work with a company/team
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Company Info Section */}
              {isCompany && (
                <>
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 md:pr-1">
                      <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company"
                                {...field}
                                className="tla-form-control"
                                onChange={(e) => {
                                  field.onChange(e);
                                  dispatch(
                                    updateNestedField({
                                      section: 'companyInfo',
                                      field: 'companyName',
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
                    <div className="w-full md:w-1/2 md:pl-1">
                      <FormField
                        control={form.control}
                        name="company_website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Website*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://"
                                {...field}
                                className="tla-form-control"
                                onChange={(e) => {
                                  field.onChange(e);
                                  dispatch(
                                    updateNestedField({
                                      section: 'companyInfo',
                                      field: 'website',
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
                  </div>

                  {/* Company Size Buttons */}
                  <div className="company-size">
                    <label className="block mb-2">
                      Company Size, Team Members
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: '2-10', value: '2_10_employees' },
                        { label: '11-50', value: '11_50_employees' },
                        { label: '51-100', value: '51_100_employees' },
                        { label: '100+', value: 'over_100_employees' },
                      ]?.map(({ label, value }) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => {
                            setLocalCompanySize(value);
                            dispatch(
                              updateNestedField({
                                section: 'companyInfo',
                                field: 'companySize',
                                value: value,
                              })
                            );
                          }}
                          className={`tla-company-size-btn ${
                            localCompanySize === value ? 'selected' : ''
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3 mt-10">
                <button
                  type="button"
                  className="btn-default btn-outline-black"
                  onClick={() => dispatch(prevStep())}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-default bg-[var(--color-special)]"
                  // disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Finish & See Leads'}
                </button>
              </div>
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
      {/* <div className="hidden lg:block lg:max-w-[31.25rem]">
        <Image
          src="/assets/img/register.webp"
          width={602}
          height={751}
          className='h-full object-cover rounded-tl-0 rounded-tr-[1.25rem] rounded-br-[1.125rem] rounded-bl-0"'
          alt="Auth Image"
        />
      </div> */}
    </div>
  );
}
