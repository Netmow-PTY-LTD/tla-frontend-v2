'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
  bulkUpdate,
  resetRegistration,
} from '@/store/features/auth/lawyerRegistrationSlice';
import {
  useLawyerRegistrationDraftMutation,
} from '@/store/features/auth/authApiService';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '../common/toasts';
import { setUser } from '@/store/features/auth/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLawyerRegistrationStepThreeFormValidation } from '@/schema/auth/lawyerRegistration.schema';
import Link from 'next/link';
import { Label } from '../ui/label';
import { Check, ChevronDown, Eye, EyeOff, Loader } from 'lucide-react';
import countries from '@/data/countries.json';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useGetCompanyListQuery } from '@/store/features/public/publicApiService';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const genderOptions = [
  { id: 1, label: 'Male', value: 'male' },
  { id: 2, label: 'Female', value: 'female' },
  { id: 3, label: 'Other', value: 'other' },
];

export default function RegisterStepThree() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const registration = useSelector((state) => state.lawyerRegistration);
  const { email, password, profile } = registration;
  const {
    phone,
    gender,
    law_society_member_number,
    practising_certificate_number,
  } = profile;

  const { companyTeam, companyName, website, companySize } =
    registration.companyInfo;

  const [localCompanySize, setLocalCompanySize] = useState(companySize || '');
  // const [isCompany, setIsCompany] = useState(false);

  const lawyerServiceMap = useSelector(
    (state) => state.lawyerRegistration.lawyerServiceMap
  );

  //console.log('lawyerServiceMap in step 3', lawyerServiceMap);

  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));

  const defaultCountry = countries?.find(
    (country) => country?.slug === cookieCountry?.slug
  );

  const schema = React.useMemo(
    () => getLawyerRegistrationStepThreeFormValidation(defaultCountry),
    [defaultCountry]
  );

  const paramsPayload = {
    countryId: defaultCountry?.countryId,
    search: query || '',
  };

  const { data: allCompanies, isLoading: isCompanyLoading } =
    useGetCompanyListQuery(paramsPayload, {
      skip: !defaultCountry?.countryId,
    });

  const filteredCompanies = useMemo(() => {
    if (!allCompanies?.data) return [];
    if (query.length < 3) return [];
    const q = query.toLowerCase();
    return allCompanies.data.filter((company) =>
      company.firmName?.toLowerCase().includes(q)
    );
  }, [query, allCompanies]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
      phone: profile?.phone,
      soloPractitioner:
        registration.lawyerServiceMap.isSoloPractitioner ?? true,
      companyTeam: false, // Set to false since solo practitioner should be true by default
      company_name: companyName,
      company_website: website,
      company_size: companySize,
      password,
      gender: profile.gender,
      law_society_member_number: profile.law_society_member_number,
      practising_certificate_number: profile.practising_certificate_number,
      agreement: false,
    },
  });

  useEffect(() => {
    if (defaultCountry) {
      // Determine if should be company mode based on existing company name
      const hasCompanyName = companyName && companyName.trim() !== '';

      form.reset({
        email,
        phone: profile?.phone,
        soloPractitioner: hasCompanyName
          ? false
          : registration.lawyerServiceMap.isSoloPractitioner ?? true,
        companyTeam: hasCompanyName ? true : false,
        company_name: companyName,
        company_website: website,
        company_size: companySize,
        password,
        gender: profile.gender,
        law_society_member_number: profile.law_society_member_number,
        practising_certificate_number: profile.practising_certificate_number,
        agreement: false,
      });
    }
  }, [
    defaultCountry,
    email,
    profile?.phone,
    companyName,
    website,
    companySize,
    password,
    profile.gender,
    profile.law_society_member_number,
    profile.practising_certificate_number,
    registration.lawyerServiceMap.isSoloPractitioner,
  ]);

  useEffect(() => {
    dispatch(
      updateNestedField({
        section: 'lawyerServiceMap',
        field: 'isSoloPractitioner',
        value: true,
      })
    );

    dispatch(
      updateNestedField({
        section: 'companyInfo',
        field: 'companyTeam',
        value: false,
      })
    );
  }, []);

  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal]);

  const handleGenderChange = (value) => {
    dispatch(updateNestedField({ section: 'profile', field: 'gender', value })); // Update Redux
    form.setValue('gender', value, { shouldValidate: true }); // Sync to RHF
  };

  const router = useRouter();
  const registrationState = useSelector((state) => state.lawyerRegistration);

  const [lawyerRegistrationDraft, { isLoading: isDraftLoading }] =
    useLawyerRegistrationDraftMutation();

  const isLoading = isDraftLoading;

  console.log('registrationState', registrationState);

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...registrationState,
        step: 3,
      };
      const result = await lawyerRegistrationDraft(payload).unwrap();
      console.log('Draft Registration API Response:', result);
      if (result?.success && result?.data?.lawyerDraftId) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('❌ Draft Registration API Error:', error);
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
            You’re just a few steps away from viewing our Family Law cases
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
                    render={({ field }) => {
                      const [showPassword, setShowPassword] = useState(false);

                      const togglePasswordVisibility = () => {
                        setShowPassword((prev) => !prev);
                      };

                      return (
                        <FormItem>
                          <FormLabel>Password*</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Enter your password"
                                {...field}
                                className="tla-form-control pr-10" // space for the icon
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
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                tabIndex={-1}
                              >
                                {showPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
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
                              const sanitizedPhone = e.target.value.replace(
                                /\s+/g,
                                ''
                              );
                              field.onChange(sanitizedPhone);
                              dispatch(
                                updateNestedField({
                                  section: 'profile',
                                  field: 'phone',
                                  value: sanitizedPhone,
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
                  <FormField
                    control={form.control}
                    name="law_society_member_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Law Society Member Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="tla-form-control"
                            onChange={(e) => {
                              field.onChange(e);
                              dispatch(
                                updateNestedField({
                                  section: 'profile',
                                  field: 'law_society_member_number',
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
                    name="practising_certificate_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practising Certificate Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="tla-form-control"
                            onChange={(e) => {
                              field.onChange(e);
                              dispatch(
                                updateNestedField({
                                  section: 'profile',
                                  field: 'practising_certificate_number',
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

              <div className="flex items-center">
                <Label className="w-1/6">Gender</Label>
                <div className="flex gap-6">
                  {genderOptions.map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`gender-${option.value}`}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        id={`gender-${option.value}`}
                        name="gender"
                        value={option.value}
                        checked={gender === option.value}
                        onChange={() => handleGenderChange(option.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-[var(--primary-color)] flex items-center justify-center transition-all
            ${gender === option.value
                            ? 'bg-[var(--primary-color)]'
                            : 'bg-transparent'
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition
              ${gender === option.value ? 'bg-white' : 'bg-transparent'}`}
                        />
                      </div>
                      <span className="text-sm text-gray-800">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Solo Practitioner */}
              <div className="flex items-center mt-6">
                <Label className="w-1/6">Work Type</Label>
                <FormField
                  control={form.control}
                  name="soloPractitioner"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <div className="flex gap-4">
                          {[
                            {
                              label: 'I will work as solo practitioner',
                              value: true,
                            },
                            {
                              label: 'I work with a company/team',
                              value: false,
                            },
                          ].map((option) => (
                            <label
                              key={option.value.toString()}
                              htmlFor={`solo-${option.value}`}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <input
                                type="radio"
                                id={`solo-${option.value}`}
                                name="soloPractitioner"
                                value={option.value.toString()}
                                checked={(field.value ?? true) === option.value}
                                onChange={() => {
                                  field.onChange(option.value);
                                  form.setValue('companyTeam', !option.value);

                                  // Force form re-render
                                  form.trigger('soloPractitioner');


                                  dispatch(
                                    updateNestedField({
                                      section: 'lawyerServiceMap',
                                      field: 'isSoloPractitioner',
                                      value: option.value,
                                    })
                                  );

                                  dispatch(
                                    updateNestedField({
                                      section: 'companyInfo',
                                      field: 'companyTeam',
                                      value: !option.value,
                                    })
                                  );

                                  if (option.value === true) {
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
                                className="sr-only"
                              />

                              <div
                                className={`w-4 h-4 rounded-full border-2 border-[var(--primary-color)] flex items-center justify-center transition-all ${field.value === option.value
                                  ? 'bg-[var(--primary-color)]'
                                  : 'bg-transparent'
                                  }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full transition ${field.value === option.value
                                    ? 'bg-white'
                                    : 'bg-transparent'
                                    }`}
                                />
                              </div>
                              <span className="text-sm text-gray-800">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Company Info Section */}
              {!form.watch('soloPractitioner') && (
                <>
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => {

                      return (
                        <FormItem>
                          <FormLabel>Select Company</FormLabel>
                          <Combobox
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val);
                              const selectedCompany = allCompanies?.data?.find(
                                (c) => c._id === val
                              );

                              // Update company info in Redux
                              dispatch(
                                updateNestedField({
                                  section: 'companyInfo',
                                  field: 'companyName',
                                  value: val,
                                })
                              );

                              // If a company is selected, automatically set work type to company/team
                              if (val) {
                                form.setValue('soloPractitioner', false);
                                form.setValue('companyTeam', true);

                                dispatch(
                                  updateNestedField({
                                    section: 'lawyerServiceMap',
                                    field: 'isSoloPractitioner',
                                    value: false,
                                  })
                                );

                                dispatch(
                                  updateNestedField({
                                    section: 'companyInfo',
                                    field: 'companyTeam',
                                    value: true,
                                  })
                                );

                                // setIsCompany(true);
                              }
                            }}
                          >
                            <div className="relative">
                              <ComboboxInput
                                className="tla-form-control w-full"
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                }
                                displayValue={(val) =>
                                  allCompanies?.data?.find((c) => c._id === val)
                                    ?.firmName || ''
                                }
                                placeholder="Select a Company"
                              />
                              <ComboboxButton className="absolute top-0 bottom-0 right-0 flex items-center pr-2">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              </ComboboxButton>
                              {query.length >= 3 ? (
                                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  {filteredCompanies?.length > 0 ? (
                                    filteredCompanies
                                      .slice(0, 10)
                                      .map((company) => (
                                        <ComboboxOption
                                          key={company._id}
                                          value={company._id}
                                          className={({ active }) =>
                                            cn(
                                              'cursor-pointer select-none relative py-2 pl-10 pr-4',
                                              active
                                                ? 'bg-blue-100 text-blue-900'
                                                : 'text-gray-900'
                                            )
                                          }
                                        >
                                          {({ selected }) => (
                                            <>
                                              <span
                                                className={cn(
                                                  'block truncate',
                                                  {
                                                    'font-medium': selected,
                                                    'font-normal': !selected,
                                                  }
                                                )}
                                              >
                                                {company.firmName}
                                              </span>
                                              {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                  <Check className="h-4 w-4" />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </ComboboxOption>
                                      ))
                                  ) : (
                                    <div className="relative text-center cursor-default select-none py-2 px-4 text-gray-500">
                                      No company found
                                    </div>
                                  )}
                                </ComboboxOptions>
                              ) : null}
                            </div>
                          </Combobox>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      );
                    }}
                  />

                  {/* <div className="flex flex-wrap">
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
                  </div> */}

                  {/* Company Size Buttons */}
                  {/* <div className="company-size">
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
                  </div> */}
                </>
              )}

              <FormField
                control={form.control}
                name="agreement"
                render={({ field }) => (
                  <FormItem className="flex items-center cursor-pointer flex-wrap">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <FormLabel
                      className="ml-2 mr-3 font-bold mt-0 cursor-pointer text-[var(--color-special)]"
                      style={{ marginTop: '0 !important' }}
                    >
                      I agree to{' '}
                      <Link href="/terms" className="underline">
                        Terms & Conditions
                      </Link>
                    </FormLabel>
                    <FormMessage className="block" />
                  </FormItem>
                )}
              />

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
                  className="btn-default bg-[var(--color-special)] flex items-center justify-center gap-2"
                  disabled={isLoading} // optional: prevent double submit
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Finish & See cases'
                  )}
                </button>
              </div>
            </form>
          </Form>
          <div className="tla-auth-footer text-center">
            <div className="mb-2">
              <span>Already have an account? </span>
              <Link href="/login">
                <b>Log In</b>
              </Link>
            </div>
            <Link href="/claime-account">
              <b>Claim Your Account</b>
            </Link>
          </div>

          <Dialog
            open={showSuccessModal}
            onOpenChange={(open) => {
              setShowSuccessModal(open);
              if (!open) {
                dispatch(resetRegistration());
                form.reset();
                setQuery('');
                setLocalCompanySize('');
              }
            }}
          >
            <DialogContent className="max-w-md rounded-2xl p-8 bg-white shadow-2xl border-none">
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-16 h-16 bg-[var(--color-special)] bg-opacity-10 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>

                <div>
                  <DialogTitle className="sr-only">
                    Account Created Successfully
                  </DialogTitle>
                  <p className="text-lg text-[var(--color-special)]">
                    Your account has been created successfully. Once your email is
                    verified, you will be able to review available cases and complete your professional profile.
                  </p>
                </div>

                <div className="bg-[var(--color-special)] bg-opacity-5 p-6 rounded-xl border border-[var(--color-special)] border-opacity-10 w-full text-center">
                  <p className="text-white font-semibold flex items-center justify-center gap-2 mb-2 uppercase text-xs tracking-wider">
                    <Mail className="w-4 h-4 text-white" /> Email Verification
                    Required
                  </p>
                  <p className="text-white text-sm leading-relaxed">
                    A verification link has been sent to your registered email
                    address. Please check your inbox or spam folder and follow the
                    instructions to activate your account.
                  </p>
                </div>
                {/* 
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-[var(--color-special)] hover:opacity-90 text-white h-12 rounded-xl text-lg font-medium transition-all outline-none"
                >
                  I'll check my email
                </Button> */}

                <p className="text-gray-400 text-xs italic">
                  This message will close automatically in 10 seconds.
                </p>
              </div>
            </DialogContent>
          </Dialog>
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
