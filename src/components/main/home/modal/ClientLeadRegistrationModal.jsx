import React, { useState, useEffect, use, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button'; // adjust if your button import path differs
import { Modal } from '@/components/UIComponents/Modal';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { Check, ChevronDown, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthClientRegisterMutation } from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/utils/verifyToken';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/features/auth/authSlice';
import { StartFrequencyOptions } from '@/data/data';
import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from 'libphonenumber-js';
import { useGetZipCodeListQuery } from '@/store/features/public/publicApiService';
import country from '@/data/au.json';

export default function ClientLeadRegistrationModal({
  modalOpen,
  setModalOpen,
  selectedServiceWiseQuestions,
  selectedService,
  countryId,
  defaultCountry,
  serviceId,
  locationId,
  zipCodeList,
  isQuestionsLoading,
}) {
  const [step, setStep] = useState(0);

  //initial data
  const [initialData, setInitialData] = useState([]);

  //full cloned question with is_checked and isExtraData
  const [fullClonedQuestions, setFullClonedQuestions] = useState([]);

  //cloned questions with 0 index
  const [partialClonedQuestions, setPartialClonedQuestions] = useState([]);

  //data to show
  const [viewData, setViewData] = useState([]);

  //selected options
  const [checkedOptions, setCheckedOptions] = useState([]);

  const [checkedOptionsDetails, setCheckedOptionsDetails] = useState([]);

  //selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [clickButtonType, setClickButtonType] = useState('Next');

  const [leadPriority, setLeadPriority] = useState('');

  const [additionalDetails, setAdditionalDetails] = useState('');

  const [questionLoading, setQuestionLoading] = useState(false);

  const [budgetAmount, setBudgetAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [searchZipCode, setSearchZipCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stepwiseCheckedOptions, setStepwiseCheckedOptions] = useState(null);
  const [newZipCodeList, setNewZipCodeList] = useState([]);
  const [isTypedNewValue, setIsTypedNewValue] = useState(false);

  useEffect(() => {
    if (!selectedServiceWiseQuestions?.length) return;

    setQuestionLoading(true); // 👈 Start loading

    setStep(0);
    setClickButtonType(null);
    setQuestionsPayload([]);
    setSelectedOptions([]);
    setCheckedOptions([]);
    setCheckedOptionsDetails([]);
    setInitialData([]);
    setFullClonedQuestions([]);
    setPartialClonedQuestions([]);
    setViewData(null);
  }, [selectedServiceWiseQuestions]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchZipCode);
    }, 500); // wait 500ms after typing

    return () => clearTimeout(timeout); // cleanup on each keystroke
  }, [searchZipCode]);

  const paramsPayload = {
    countryId: countryId,
    search: debouncedSearch || '',
  };

  const { data: allZipCodes, isLoading: isZipCodeLoading } =
    useGetZipCodeListQuery(paramsPayload, {
      skip: !countryId || !debouncedSearch,
    });

  useEffect(() => {
    if (isTypedNewValue) {
      if (allZipCodes?.data?.length > 0) {
        setNewZipCodeList(allZipCodes.data);
      }
    } else {
      if (zipCodeList?.length > 0) {
        setNewZipCodeList(zipCodeList);
      }

      if (locationId && newZipCodeList?.length > 0) {
        setZipCode(locationId);

        const selectedZip = newZipCodeList?.find((z) => z._id === locationId);
        if (selectedZip) {
          setPostalCode(selectedZip?.postalCode);
          setLatitude(selectedZip?.latitude);
          setLongitude(selectedZip?.longitude);
          setAddress(selectedZip?.zipcode); // full formatted address
          setSearchZipCode(selectedZip?.zipcode);
        }
      }
    }
  }, [locationId, newZipCodeList, allZipCodes, zipCodeList]);

  const handleZipCodeSearch = (e) => {
    if (e.target.value !== '') {
      setIsTypedNewValue(true);
    }
  };

  const addressInfo = {
    countryId: country.countryId,
    countryCode: country.code.toLowerCase(),
    zipcode: address || '',
    latitude: latitude?.toString() || '',
    longitude: longitude?.toString() || '',
    postalCode: postalCode || '',
  };

  // console.log('addressInfo', addressInfo);

  //setting initial data

  useEffect(() => {
    setInitialData(selectedServiceWiseQuestions);
  }, [selectedServiceWiseQuestions]);

  useEffect(() => {
    if (clickButtonType === 'Next') {
      setSelectedOptions([]);
      setCheckedOptions([]);
      setCheckedOptionsDetails([]);
    }
  }, [step]);

  const totalQuestions = selectedServiceWiseQuestions?.length;

  const totalFormsSteps = 7;

  const totalSteps = totalQuestions + totalFormsSteps;

  //cloning full with is_checked and isExtraData. This data is needed when previous step is clicked
  useEffect(() => {
    if (!selectedServiceWiseQuestions?.length) return;

    const cloned = selectedServiceWiseQuestions.map((q) => ({
      ...q,
      options: q.options.map((opt) => ({
        ...opt,
        is_checked: false,
        idExtraData: '',
      })),
    }));

    setFullClonedQuestions(cloned);
  }, [selectedServiceWiseQuestions]);

  //partial cloning

  useEffect(() => {
    if (!fullClonedQuestions?.length) return;

    const cloned = fullClonedQuestions.map(({ options, ...rest }) => ({
      ...rest,
      options: [], // You can remove this line if you don't want `options` at all
    }));

    setPartialClonedQuestions(cloned);
    setQuestionLoading(false);
  }, [fullClonedQuestions]);

  const options = selectedServiceWiseQuestions?.[step]?.options || [];

  const handleOptionChange = (optionId, checked) => {
    const parentQuestion = fullClonedQuestions?.find((q) =>
      q.options?.some((opt) => opt._id === optionId)
    );

    if (!parentQuestion) return;

    const foundOption = parentQuestion.options.find(
      (opt) => opt._id === optionId
    );

    const tempOption = {
      id: optionId,
      name: foundOption?.name,
      is_checked: checked,
      idExtraData:
        foundOption?.name === 'Other'
          ? document.getElementById(`${optionId}-other`)?.value ?? ''
          : '',
    };

    let newCheckedOptionsDetails;

    if (parentQuestion.questionType === 'radio') {
      newCheckedOptionsDetails = checked ? [tempOption] : [];
      setCheckedOptions(checked ? [optionId] : []);
      setSelectedOptions(checked ? foundOption.selected_options : []);
    } else {
      // checkbox
      newCheckedOptionsDetails = checked
        ? [
            ...checkedOptionsDetails.filter((o) => o.id !== optionId),
            tempOption,
          ]
        : checkedOptionsDetails.filter((o) => o.id !== optionId);

      setCheckedOptions(
        checked
          ? [...checkedOptions, optionId]
          : checkedOptions.filter((id) => id !== optionId)
      );

      setSelectedOptions((prev) => {
        if (checked) {
          const combined = [...prev, ...(foundOption.selected_options || [])];
          return Array.from(
            new Map(combined.map((item) => [item._id, item])).values()
          );
        } else {
          return prev.filter(
            (item) =>
              !(foundOption.selected_options || []).some(
                (opt) => opt._id === item._id
              )
          );
        }
      });
    }

    // update state
    setCheckedOptionsDetails(newCheckedOptionsDetails);
    setStepwiseCheckedOptions(newCheckedOptionsDetails);

    // update viewData immediately
    if (fullClonedQuestions[step]) {
      const updatedQuestion = {
        ...fullClonedQuestions[step],
        options: fullClonedQuestions[step].options.map((opt) => {
          const matched = newCheckedOptionsDetails.find(
            (o) => o.id === opt._id
          );
          return {
            ...opt,
            is_checked: matched?.is_checked || false,
            idExtraData: matched?.idExtraData || '',
          };
        }),
      };
      setViewData(updatedQuestion);
    }
  };

  // console.log('checkedOptions', checkedOptionsDetails);
  // console.log('step', step);

  useEffect(() => {
    if (step === 0) {
      partialClonedQuestions[step] = fullClonedQuestions?.[step];
      // setViewData(fullClonedQuestions?.[step]);
    } else {
      if (clickButtonType === 'Next') {
        partialClonedQuestions[step] = {
          ...partialClonedQuestions[step],
          options: selectedOptions,
        };
      }
      // setViewData(partialClonedQuestions?.[step]);
    }

    setViewData(partialClonedQuestions?.[step]);
  }, [step, partialClonedQuestions]);

  const [questionsPayload, setQuestionsPayload] = useState([]);

  const [clientRegister] = useAuthClientRegisterMutation();

  //handleNext button click and form submission with api call
  const handleNext = async () => {
    const isFinalStep = step === totalSteps;
    const isQuestionStep = step < totalQuestions;

    // Step 1: Handle question payload update
    if (isQuestionStep) {
      setQuestionsPayload((prev) => {
        const filtered = prev.filter((item) => item.step !== step);

        const questionId = selectedServiceWiseQuestions?.[step]?._id;
        const question = selectedServiceWiseQuestions?.[step]?.question;
        const order = selectedServiceWiseQuestions?.[step]?.order;

        return [
          ...filtered,
          {
            step,
            questionId,
            question,
            order,
            checkedOptionsDetails: stepwiseCheckedOptions || [],
          },
        ];
      });
    }

    // Step 2: Go to next step if not final
    if (!isFinalStep) {
      setStep((prev) => prev + 1);
      setClickButtonType('Next');
      return;
    }

    setIsSubmitting(true);

    // Step 3: Prepare payloads on final step
    const leadDetails = {
      leadPriority,
      additionalDetails,
      budgetAmount,
      zipCode: addressInfo?.zipcode,
      name,
      email,
      phone,
    };

    const payload = {
      countryId,
      serviceId,
      questions: [...questionsPayload], // ensure fresh snapshot
      leadDetails,
      addressInfo,
    };

    console.log('🚀 Submitting payload:', payload);

    try {
      const res = await clientRegister(payload).unwrap();
      console.log('✅ Register response:', res);

      if (!res?.success || !res?.token) {
        showErrorToast(res?.message || 'Case registration failed.');
        return;
      }

      showSuccessToast(res?.message || 'Case registered successfully');

      const token = res.token;
      const userPayload = verifyToken(token);

      if (userPayload) {
        dispatch(setUser({ user: res?.data?.userData, token }));

        const userType = res?.data?.userData?.regUserType;

        setQuestionsPayload([]); // Clear form state
        setModalOpen(false); // Close modal

        if (userType === 'client') {
          router.push(`/client/dashboard/my-cases/${res?.data?.leadUser?._id}`);
          //router.push(`/client/dashboard/my-cases`);
        } else {
          router.push('/');
        }
      } else {
        showErrorToast('Invalid token. Registration failed.');
      }
    } catch (err) {
      console.error('❌ Register error:', err);
      showErrorToast(err?.data?.message || 'Failed to register case.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleBack = () => {
  //   const newStep = Math.max(step - 1, 0);
  //   setStep(newStep);
  //   setClickButtonType('Prev');

  //   const existingStepData = questionsPayload.find(
  //     (item) => item.step === newStep
  //   );
  //   setCheckedOptionsDetails(existingStepData?.checkedOptionsDetails || []);
  // };

  const handleBack = () => {
    const newStep = Math.max(step - 1, 0);
    setStep(newStep);
    setClickButtonType('Prev');

    const existingStepData = questionsPayload?.find(
      (item) => item.step === newStep
    );

    const restoredOptions = existingStepData?.checkedOptionsDetails || [];

    setCheckedOptionsDetails(restoredOptions);
    setStepwiseCheckedOptions(restoredOptions); // 👈 keep in sync
  };

  const isValidPhone = (phone) => isValidPhoneNumber(phone);

  const isNextDisabled = (() => {
    // Step: Questions (required) — check checkedOptions length instead of answers
    if (step < totalQuestions) {
      return stepwiseCheckedOptions?.length === 0;
    }

    //Step: Additional Details (optional)
    if (step === totalQuestions) {
      return !leadPriority?.trim();
    }

    if (step === totalQuestions + 1) {
      // return !additionalDetails?.trim();
    }

    if (step === totalQuestions + 2) {
      return !additionalDetails?.trim();
    }

    if (step === totalQuestions + 3) {
      return !budgetAmount?.trim();
    }

    // Step: ZIP Code (required)
    if (step === totalQuestions + 4) {
      return !zipCode || !zipCode?.trim();
    }

    if (step === totalQuestions + 5) {
      return !name || !name?.trim();
    }

    // Step: Email (required and validated)
    if (step === totalQuestions + 6) {
      return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (step === totalQuestions + 7) {
      const parsed = parsePhoneNumberFromString(phone, 'AU');

      return !parsed || !parsed.isValid() || parsed.country !== 'AU';
    }

    // Step: Phone (optional)
    return false;
  })();

  // Update stepwiseCheckedOptions whenever step or questionsPayload changes
  useEffect(() => {
    const existing = questionsPayload?.find((item) => item.step === step);
    setStepwiseCheckedOptions(existing?.checkedOptionsDetails || []);
  }, [step, questionsPayload]); // only run when step or questionsPayload change

  // console.log('stepwise checked items:', stepwiseCheckedOptions);
  // console.log('viewData:', viewData);

  // Update viewData options with checked state
  useEffect(() => {
    if (!fullClonedQuestions[step]) return;

    const updatedQuestion = {
      ...fullClonedQuestions[step],
      options: fullClonedQuestions[step].options.map((opt) => {
        const matched = stepwiseCheckedOptions?.find(
          (item) => item.id === opt._id
        );
        return {
          ...opt,
          is_checked: matched?.is_checked || false,
          idExtraData: matched?.idExtraData || '',
        };
      }),
    };

    setViewData(updatedQuestion);
  }, [fullClonedQuestions, step, stepwiseCheckedOptions]);

  //console.log('stepwiseCheckedOptions:', stepwiseCheckedOptions);
  //console.log('selectedService:', selectedService);
  console.log('zipCode:', zipCode);

  return (
    <Modal
      open={modalOpen}
      onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          setStep(0); // reset form steps, if needed
          // setViewData(null);
          // setQuestionsPayload([]);
          setQuestionLoading(false);
        }
      }}
      title=""
      width="max-w-[570px]"
      height="max-h-[90vh]"
      overlayBg={
        step >= totalQuestions + 1 ? '/assets/img/blur-profile.webp' : ''
      }
      paddingTop="pt-0"
      paddingLeft="pl-0"
      paddingRight="pr-0"
      border="border-0"
      showCloseButton={true}
    >
      {isQuestionsLoading || !selectedServiceWiseQuestions?.length ? (
        <div className="flex items-center justify-center gap-2 pt-6 px-6">
          <Loader className="w-4 h-4 animate-spin" /> Loading question...
        </div>
      ) : step < totalQuestions ? (
        viewData?.question ? (
          <div className="space-y-4">
            {step === 0 && selectedService?.serviceField?.bannerImage && (
              <div
                className="w-full max-h-[120px] bg-cover bg-center bg-no-repeat rounded-t-lg"
                style={{
                  backgroundImage: `url(${selectedService.serviceField.bannerImage})`,
                  height: '120px',
                }}
              />
            )}
            <div className="px-6 pt-6">
              <h4 className="text-[24px] font-semibold text-center mb-8">
                {viewData.question}
              </h4>
              <div className="border border-1 flex flex-col gap-2 rounded-lg max-h-[300px] overflow-y-auto">
                {viewData?.options?.length > 0 &&
                  viewData?.options?.map((option, index) => {
                    const isLast = index === viewData.options.length - 1;
                    const isOther = option?.name?.toLowerCase() === 'other';

                    const isChecked = option?.is_checked;

                    return (
                      <label
                        key={option._id || index}
                        className={`flex gap-3 px-4 py-3 ${
                          !isLast ? 'border-b' : ''
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type={
                              viewData.questionType === 'checkbox'
                                ? 'checkbox'
                                : 'radio'
                            }
                            name={`question-${viewData._id}`}
                            onChange={(e) =>
                              handleOptionChange(option._id, e.target.checked)
                            }
                            checked={isChecked}
                          />

                          {/* Render name only if not 'Other' */}
                          {option?.name !== 'Other' && (
                            <span>{option?.name}</span>
                          )}
                        </span>

                        {/* Render input only if option is 'Other' */}
                        {isOther && (
                          <input
                            type="text"
                            id={`${option._id}-other`}
                            placeholder="Other"
                            className="border rounded px-2 py-1 w-full"
                            // onChange={(e) =>
                            //   handleOptionChange(option._id, e.target.value)
                            // }
                          />
                        )}
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No question found
          </div>
        )
      ) : step === totalQuestions ? (
        <div className="space-y-6 px-6 pt-6">
          <h4 className="text-[24px] font-semibold text-center">
            When are you looking to get started?
          </h4>
          <div className="border border-1 flex flex-col gap-2 rounded-lg">
            {StartFrequencyOptions.map((frequency) => {
              const isLast = frequency.value === 'not_sure';
              return (
                <label
                  className={`flex gap-3 px-4 py-3 ${
                    !isLast ? 'border-b' : ''
                  }`}
                  key={frequency.id}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={frequency.value}
                    checked={leadPriority === frequency?.value}
                    onChange={(e) => setLeadPriority(e.target.value)}
                  />
                  <span>{frequency.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : step === totalQuestions + 1 ? (
        <div className="space-y-6 pt-6 px-6">
          <div className="text-center flex flex-col items-center gap-4 border-b border-gray-200 pb-6">
            <svg
              width="50"
              height="50"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_144_2662)">
                <rect width="64" height="64" fill="none"></rect>
                <rect width="64" height="64" rx="32" fill="#47BF9C"></rect>
                <path
                  d="M28.0002 37.5598L23.3735 32.9331C22.8535 32.4131 22.0135 32.4131 21.4935 32.9331C20.9735 33.4531 20.9735 34.2931 21.4935 34.8131L27.0668 40.3864C27.5868 40.9064 28.4268 40.9064 28.9468 40.3864L43.0535 26.2798C43.5735 25.7598 43.5735 24.9198 43.0535 24.3998C42.5335 23.8798 41.6935 23.8798 41.1735 24.3998L28.0002 37.5598Z"
                  fill="white"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_144_2662">
                  <rect width="64" height="64" fill="none"></rect>
                </clipPath>
              </defs>
            </svg>
            <h2 className="text-2xl font-semibold">
              Great! We've found you the perfect matches.
            </h2>
            <h2 className="text-lg font-medium">
              Lastly, we need your details to <br className="sm:tw-hidden" />
              attach to your request.
            </h2>
          </div>
        </div>
      ) : step === totalQuestions + 2 ? (
        <div className="space-y-6 px-6 pt-6">
          <h4 className="text-[24px] font-semibold text-center">
            Want to share anything more?
          </h4>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Additional Details</span>
            <textarea
              className="border rounded px-3 py-2 min-h-[100px]"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Provide any specific info or instructions for the service..."
            />
          </label>
        </div>
      ) : step === totalQuestions + 3 ? (
        <div className="space-y-6 pt-6 px-6">
          <h4 className="text-[24px] font-semibold text-center">
            What is your estimated budget?
          </h4>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Estimated Budget</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                min={0}
                step={1}
                className="border rounded px-3 py-2 w-full"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <input
                type="text"
                className="border rounded px-3 py-2 w-20 text-center"
                defaultValue={country.currency}
                placeholder='currency i.e. "AUD"'
                readOnly
              />
            </div>
          </div>
        </div>
      ) : step === totalQuestions + 4 ? (
        <div className="space-y-4 pt-6 px-6">
          <h4 className="text-[24px] font-semibold text-center">
            Where do you need the service?
          </h4>
          <div className="text-center">
            The postcode or town for the address where you want the service.
          </div>
          <Combobox
            value={zipCode ?? ''}
            onChange={(selectedId) => {
              console.log('selectedId', selectedId);
              setZipCode(selectedId);

              const selectedZip = newZipCodeList?.find(
                (z) => z._id === selectedId
              );
              if (selectedZip) {
                setPostalCode(selectedZip.postalCode);
                setLatitude(selectedZip.latitude);
                setLongitude(selectedZip.longitude);
                setAddress(selectedZip.zipcode); // full formatted address
                setSearchZipCode(selectedZip.zipcode);
              }
            }}
          >
            <div className="relative">
              <ComboboxInput
                className="border border-gray-300 rounded-md w-full h-[44px] px-4"
                onChange={(event) => {
                  setSearchZipCode(event.target.value);
                }}
                onKeyUp={(e) => handleZipCodeSearch(e)}
                displayValue={(id) =>
                  allZipCodes?.data?.find((z) => z._id === id)?.zipcode || ''
                }
                placeholder="Select a postcode"
                autoComplete="off"
              />
              <ComboboxButton className="absolute top-0 bottom-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </ComboboxButton>

              {newZipCodeList?.length > 0 && (
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {newZipCodeList?.slice(0, 10).map((item) => (
                    <ComboboxOption
                      key={item._id}
                      value={item._id} // ✅ keep _id as the value
                      className={({ active }) =>
                        cn(
                          'cursor-pointer select-none relative py-2 px-6',
                          active ? 'bg-blue-100 text-black' : 'text-gray-900'
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
                            {item.zipcode}
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
      ) : step === totalQuestions + 5 ? (
        <div className="space-y-6 pt-6 px-6">
          <h4 className="text-[24px] font-semibold text-center">
            Write a few words about yourself?
          </h4>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Enter Your Name</span>
            <input
              type="text"
              className="border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mark Smith"
            />
          </label>
        </div>
      ) : step === totalQuestions + 6 ? (
        <div className="space-y-6 pt-6 px-6">
          <h4 className="text-[24px] font-semibold text-center">
            What email address would you like quotes sent to?
          </h4>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Enter Your Valid Email Address
            </span>
            <input
              type="email"
              className="border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., example@email.com"
            />
          </label>
        </div>
      ) : step === totalSteps ? (
        <div className="space-y-6 pt-6 px-6">
          <h4 className="text-[24px] font-semibold text-center">
            What phone number can we reach you on?
          </h4>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Enter Your Valid Phone Number
            </span>
            <input
              type="tel"
              className="border rounded px-3 py-2"
              value={phone}
              onChange={(e) => {
                const input = e.target.value;

                // Remove all spaces
                const noSpaces = input.replace(/\s+/g, '');

                // Allow only numbers, or numbers starting with + (for +61)
                const sanitized = noSpaces.replace(/(?!^\+)[^\d]/g, '');

                setPhone(sanitized);
              }}
              placeholder="e.g., 0123456789"
            />
          </label>
        </div>
      ) : null}

      {isQuestionsLoading ||
        (selectedServiceWiseQuestions?.length > 0 && (
          <div
            className={`flex ${
              step === 0 ? 'justify-end' : 'justify-between'
            } mt-8 px-6`}
          >
            {step !== 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
              >
                Back
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isNextDisabled || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : step === totalSteps ? (
                'Finish'
              ) : (
                'Next'
              )}
            </Button>
          </div>
        ))}
    </Modal>
  );
}
