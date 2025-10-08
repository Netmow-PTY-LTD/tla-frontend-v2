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
  bulkUpdate,
} from '@/store/features/auth/lawyerRegistrationSlice';
import { useAuthRegisterMutation } from '@/store/features/auth/authApiService';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '../common/toasts';
import { verifyToken } from '@/utils/verifyToken';
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

const genderOptions = [
  { id: 1, label: 'Male', value: 'male' },
  { id: 2, label: 'Female', value: 'female' },
  { id: 3, label: 'Other', value: 'other' },
];

export default function RegisterStepThree() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
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
  const [isCompany, setIsCompany] = useState(false);

  const lawyerServiceMap = useSelector(
    (state) => state.lawyerRegistration.lawyerServiceMap
  );

  // useEffect(() => {
  //   setIsCompany(companyTeam); // This will always be false initially unless updated
  // }, [companyTeam]);

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

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
      phone: profile?.phone,
      soloPractitioner: registration.lawyerServiceMap.isSoloPractitioner,
      companyTeam: companyTeam,
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
      form.reset(); // clears the form
    }
  }, [defaultCountry]);

  useEffect(() => {
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
        value: false,
      })
    );
  }, []);

  // useEffect(() => {
  //   // Sync redux data to local form
  //   form.reset({
  //     email,
  //     phone: profile?.phone,
  //     password,
  //     soloPractitioner: registration.lawyerServiceMap.isSoloPractitioner,
  //     companyTeam,
  //     company_name: companyName,
  //     company_website: website,
  //     company_size: companySize,
  //     gender: profile.gender,
  //     law_society_member_number: profile.law_society_member_number,
  //     practising_certificate_number: profile.practising_certificate_number,
  //   });
  // }, [
  //   email,
  //   profile?.phone,
  //   password,
  //   companyTeam,
  //   companyName,
  //   website,
  //   companySize,
  //   profile.gender, // ✅ include gender so reset reacts
  //   profile.law_society_member_number,
  //   profile.practising_certificate_number,
  // ]);

  console.log('companyTeam from Redux:', companyTeam);
  console.log(
    'soloPractitioner from Redux:',
    registration.lawyerServiceMap.isSoloPractitioner
  );
  console.log('Default values passed to form:', form.getValues());

  const handleGenderChange = (value) => {
    dispatch(updateNestedField({ section: 'profile', field: 'gender', value })); // Update Redux
    form.setValue('gender', value, { shouldValidate: true }); // Sync to RHF
  };

  const router = useRouter();
  const registrationState = useSelector((state) => state.lawyerRegistration);
  const [authRegister, { isLoading }] = useAuthRegisterMutation();

  console.log('registrationState', registrationState);

  const handleSubmit = async (data) => {
    console.log('data', data);
    try {
      const result = await authRegister(registrationState).unwrap();
      if (result?.success && result?.token) {
        showSuccessToast(result?.message || 'Registration successful');
        const token = result.token;
        const userPayload = verifyToken(token);
        console.log('userPayload', userPayload);
        if (userPayload) {
          dispatch(
            setUser({
              user: { ...result?.data, country: userPayload?.country },
              token,
            })
          );
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
            ${
              gender === option.value
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
                                checked={
                                  (field.value ?? false) === option.value
                                }
                                onChange={() => {
                                  field.onChange(option.value);
                                  form.setValue('companyTeam', !option.value);

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
                                    setIsCompany(false);
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
                                  } else {
                                    setIsCompany(true);
                                  }
                                }}
                                className="sr-only"
                              />

                              <div
                                className={`w-4 h-4 rounded-full border-2 border-[var(--primary-color)] flex items-center justify-center transition-all ${
                                  field.value === option.value
                                    ? 'bg-[var(--primary-color)]'
                                    : 'bg-transparent'
                                }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full transition ${
                                    field.value === option.value
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
              {isCompany && (
                <>
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => {
                      console.log('company_name field', field);
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

                              dispatch(
                                updateNestedField({
                                  section: 'companyInfo',
                                  field: 'companyName',
                                  value: val,
                                })
                              );
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
                              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {allCompanies?.data?.length > 0 ? (
                                  allCompanies.data
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
                                              className={cn('block truncate', {
                                                'font-medium': selected,
                                                'font-normal': !selected,
                                              })}
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
                                  <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                                    No company found
                                  </div>
                                )}
                              </ComboboxOptions>
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
