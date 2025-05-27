'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
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

export default function RegisterStepThreeTest() {
  const dispatch = useDispatch();
  const registration = useSelector((state) => state.lawyerRegistration);
  const { username, email } = registration;
  const { phone, companyTeam, companyName, website, companySize } =
    registration.companyInfo;

  const [localCompanySize, setLocalCompanySize] = useState(companySize || '');
  const [isCompany, setIsCompany] = useState(companyTeam || false);

  const form = useForm({
    defaultValues: {
      username,
      email,
      phone,
      soloPractitioner: registration.lawyerServiceMap.isSoloPractitioner,
      companyTeam,
      company_name: companyName,
      company_website: website,
      company_size: companySize,
    },
  });

  useEffect(() => {
    // Sync redux data to local form
    form.reset({
      username,
      email,
      phone,
      soloPractitioner: registration.lawyerServiceMap.isSoloPractitioner,
      companyTeam,
      company_name: companyName,
      company_website: website,
      company_size: companySize,
    });
  }, [username, email, phone, companyTeam, companyName, website, companySize]);

  const router = useRouter();
  const registrationState = useSelector((state) => state.lawyerRegistration);
  const [authRegister, { isLoading }] = useAuthRegisterMutation();

  const handleSubmit = async () => {
    try {
      const result = await authRegister(registrationState).unwrap();
      console.log('✅ Registration result:', result);

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
        showErrorToast(result?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('❌ Registration API Error:', error);
      showErrorToast(error?.data?.message || 'Server error');
    }
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center">
      <div className="hidden lg:block lg:max-w-[602px]">
        <Image
          src="/assets/img/auth-step3.png"
          width={602}
          height={751}
          alt="Auth Image"
        />
      </div>

      <div className="w-full lg:w-7/12">
        <div className="tla-auth-form tla-auth-form-register">
          <h2 className="tla-auth-title mb-2">Some details about you</h2>
          <p className="tla-auth-subtitle mb-5">
            You’re just a few steps away from viewing our Family Law leads
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
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
                                  section: 'companyInfo',
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

              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 md:pr-1">
                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="tla-form-control"
                            onChange={(e) => {
                              field.onChange(e);
                              dispatch(
                                updateField({
                                  field: 'username',
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

              {/* Solo Practitioner */}
              <FormField
                control={form.control}
                name="soloPractitioner"
                render={({ field }) => (
                  <FormItem className="flex items-center">
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
                    <FormLabel className="ml-2 font-bold">
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
                    <FormLabel className="ml-2 font-bold">
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
                      {['2-10', '11-50', '51-100', '100+'].map((size) => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => {
                            setLocalCompanySize(size);
                            dispatch(
                              updateNestedField({
                                section: 'companyInfo',
                                field: 'companySize',
                                value: size,
                              })
                            );
                          }}
                          className={`tla-company-size-btn ${
                            localCompanySize === size ? 'selected' : ''
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-end gap-3 mt-10">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => dispatch(prevStep())}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-auth-register"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Finish & See Leads'}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
