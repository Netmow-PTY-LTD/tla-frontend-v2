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
  countryId,
  serviceId,
  locationId,
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
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');

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

  // const { data: allZipCodes, isLoading: isZipCodeLoading } =
  //   useGetZipCodeListQuery();

  // const filteredZipCodes = allZipCodes?.data?.filter((item) =>
  //   zipCode
  //     ? item?.zipcode?.toLowerCase().includes(zipCode.toLowerCase())
  //     : true
  // );

  console.log('locationId', locationId);

  useEffect(() => {
    if (locationId) {
      setAddress(locationId); // Set ID, not zipcode text
    }
  }, [locationId]);

  //google map data
  // const { watch, setValue } = form;
  // const address = watch('AreaZipcode');

  const inputRef = useRef(null);

  useEffect(() => {
    // Inject high-priority styles once
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
    .google-places-autocomplete .pac-container {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      width: 518px !important;
      z-index: 9999 !important;
    }
  `;
    document.head.appendChild(styleTag);

    let autocomplete;
    let observer;

    const initialize = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ['geometry', 'formatted_address', 'address_components'],
        }
      );

      autocomplete.setComponentRestrictions({ country: ['au'] });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const postalCodeObj = place.address_components.find((c) =>
          c.types.includes('postal_code')
        );
        const postal = postalCodeObj ? postalCodeObj.long_name : '';

        setZipCode(postal);
        setAddress(place.formatted_address);
        setLatitude(place.geometry.location.lat);
        setLongitude(place.geometry.location.lng);
      });

      observer = new MutationObserver(() => {
        const pacContainer = document.querySelector('.pac-container');
        const targetWrapper = document.querySelector(
          '.google-places-autocomplete'
        );

        if (
          pacContainer &&
          targetWrapper &&
          !targetWrapper.contains(pacContainer)
        ) {
          targetWrapper.appendChild(pacContainer);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    };

    const interval = setInterval(() => {
      if (inputRef.current && window.google?.maps?.places) {
        initialize();
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (observer) observer.disconnect();
    };
  }, []);

  // Geocode fallback for manual typing
  useEffect(() => {
    if (!address) return;

    // Only fetch if the user typed manually (zipCode not set yet)
    if (zipCode) return; // skip fetch after Autocomplete selection

    const fetchCoordinates = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();

        if (data.status === 'OK') {
          const coords = data.results[0].geometry.location;
          const formattedAddress = data.results[0].formatted_address;

          const postalCodeObj = data.results[0].address_components.find((c) =>
            c.types.includes('postal_code')
          );
          const postal = postalCodeObj ? postalCodeObj.long_name : '';

          setZipCode(postal);
          setAddress(formattedAddress);
          setLatitude(coords.lat);
          setLongitude(coords.lng);
        }
      } catch (err) {
        console.error('Failed to fetch coordinates', err);
      }
    };

    fetchCoordinates();
  }, [address]);

  // console.log('zipCode', zipCode);
  // console.log('address', address);
  // console.log('latitude', latitude);
  // console.log('longitude', longitude);

  const addressInfo = {
    countryId: country.countryId,
    countryCode: country.code.toLowerCase(),
    zipcode: address,
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    postalCode: zipCode,
  };

  console.log('addressInfo', addressInfo);

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

  const totalFormsSteps = 6;

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
    if (!fullClonedQuestions.length) return;

    const cloned = fullClonedQuestions.map(({ options, ...rest }) => ({
      ...rest,
      options: [], // You can remove this line if you don't want `options` at all
    }));

    setPartialClonedQuestions(cloned);
    setQuestionLoading(false);
  }, [fullClonedQuestions]);

  const options = selectedServiceWiseQuestions?.[step]?.options || [];

  const handleOptionChange = (optionId, checked) => {
    const parentQuestion = fullClonedQuestions?.find((question) =>
      question.options?.some((option) => option._id === optionId)
    );

    const foundOption = parentQuestion?.options?.find(
      (option) => option._id === optionId
    );

    const questionType = parentQuestion?.questionType;

    console.log('questionType', questionType);

    const tempOption = {
      id: optionId,
      name: foundOption?.name,
      is_checked: checked,
      idExtraData:
        foundOption?.name === 'Other'
          ? document.getElementById(`${optionId}-other`)?.value ?? ''
          : '',
    };

    const findSelectedOptions = options?.find((item) => item?._id === optionId);

    // Handle "radio" type first and return early
    if (questionType === 'radio') {
      if (checked) {
        setCheckedOptions([optionId]);
        setCheckedOptionsDetails([tempOption]);
        setSelectedOptions(findSelectedOptions?.selected_options || []);
      } else {
        setCheckedOptions([]);
        setCheckedOptionsDetails([]);
        setSelectedOptions([]);
      }
      return; // skip rest of the logic
    }

    // Handle multi-select (checkbox) types
    const newCheckedOptions = checked
      ? [...checkedOptions, optionId]
      : checkedOptions.filter((id) => id !== optionId);

    setCheckedOptions(newCheckedOptions);

    setCheckedOptionsDetails((prev) => {
      if (checked) {
        const filtered = prev.filter((item) => item.id !== optionId);
        return [...filtered, tempOption];
      } else {
        return prev.filter((item) => item.id !== optionId);
      }
    });

    if (checked) {
      setSelectedOptions((prev) => {
        const newOptions = findSelectedOptions?.selected_options || [];
        const combined = [...prev, ...newOptions];
        const unique = Array.from(
          new Map(combined.map((item) => [item._id, item])).values()
        );
        return unique;
      });
    } else {
      setSelectedOptions((prev) =>
        prev.filter(
          (item) =>
            !findSelectedOptions?.selected_options?.some(
              (opt) => opt._id === item._id
            )
        )
      );
    }
  };

  //console.log('checkedOptions', checkedOptionsDetails);

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
            checkedOptionsDetails,
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
        dispatch(setUser({ user: res?.data, token }));

        const userType = res?.data?.regUserType;

        setQuestionsPayload([]); // Clear form state
        setModalOpen(false); // Close modal

        if (userType === 'client') {
          setTimeout(() => {
            router.push('/client/dashboard/my-cases');
          }, 2000);
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

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setClickButtonType('Prev');
  };

  const isValidPhone = (phone) => isValidPhoneNumber(phone);

  const isNextDisabled = (() => {
    // Step: Questions (required) — check checkedOptions length instead of answers
    if (step < totalQuestions) {
      return checkedOptions.length === 0;
    }

    //Step: Additional Details (optional)
    if (step === totalQuestions) {
      return !leadPriority.trim();
    }

    if (step === totalQuestions + 1) {
      return !additionalDetails.trim();
    }

    if (step === totalQuestions + 2) {
      return !budgetAmount.trim();
    }

    // Step: ZIP Code (required)
    if (step === totalQuestions + 3) {
      return !zipCode || !zipCode.trim();
    }

    if (step === totalQuestions + 4) {
      return !name || !name.trim();
    }

    // Step: Email (required and validated)
    if (step === totalQuestions + 5) {
      return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (step === totalQuestions + 6) {
      // ✅ Use libphonenumber-js validation
      const parsed = parsePhoneNumberFromString(phone);

      return (
        !parsed || !parsed.isValid() || parsed.country !== 'AU' // ensures it's an Australian number
      );
    }

    // Step: Phone (optional)
    return false;
  })();

  // console.log('isQuestionsLoading:', isQuestionsLoading);
  // console.log('selectedServiceWiseQuestions:', selectedServiceWiseQuestions);
  // console.log(
  //   '!selectedServiceWiseQuestions?.length:',
  //   !selectedServiceWiseQuestions?.length
  // );

  //console.log('filteredzipCodes:', filteredzipCodes);

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
    >
      {isQuestionsLoading || !selectedServiceWiseQuestions?.length ? (
        <div className="flex items-center justify-center gap-2">
          <Loader className="w-4 h-4 animate-spin" /> Loading question...
        </div>
      ) : step < totalQuestions ? (
        viewData?.question ? (
          <div className="space-y-4 mt-4">
            <h4 className="text-[24px] font-semibold text-center mb-8">
              {viewData.question}
            </h4>
            <div className="border border-1 flex flex-col gap-2 rounded-lg max-h-[300px] overflow-y-auto">
              {viewData.options?.length > 0 &&
                viewData.options?.map((option, index) => {
                  const isLast = index === viewData.options.length - 1;
                  const isOther = option?.name?.toLowerCase() === 'other';

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
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No question found
          </div>
        )
      ) : step === totalQuestions ? (
        <div className="space-y-6">
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
                    onChange={(e) => setLeadPriority(e.target.value)}
                  />
                  <span>{frequency.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : step === totalQuestions + 1 ? (
        <div className="space-y-6">
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
      ) : step === totalQuestions + 2 ? (
        <div className="space-y-6">
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
      ) : step === totalQuestions + 3 ? (
        <div className="space-y-4">
          <h4 className="text-[24px] font-semibold text-center">
            Where do you need the service?
          </h4>
          <div className="text-center">
            The postcode or town for the address where you want the service.
          </div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className="border border-gray-300 rounded-md w-full h-[44px] px-4"
              placeholder="Enter Zipcode"
              autoComplete="off"
              value={address} // ✅ controlled input for full address
              onChange={(e) => setAddress(e.target.value)} // updates address while typing
            />
            <div className="google-places-autocomplete"></div>
          </div>
        </div>
      ) : step === totalQuestions + 4 ? (
        <div className="space-y-6">
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
      ) : step === totalQuestions + 5 ? (
        <div className="space-y-6">
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
        <div className="space-y-6">
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
              onChange={(e) => setPhone(e.target.value)}
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
            } mt-8`}
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
