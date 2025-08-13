import React, { useState, useEffect, use, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button'; // adjust if your button import path differs
import { Modal } from '@/components/UIComponents/Modal';
import { useGetZipCodeListQuery } from '@/store/features/public/publicApiService';
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
import TextInput from '@/components/form/TextInput';
import { Input } from '@/components/ui/input';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import { useCreateLeadMutation } from '@/store/features/client/LeadsApiService';
import { set } from 'zod';
import { StartFrequencyOptions } from '@/data/data';
import country from '@/data/au.json';

export default function ClientNewLeadRegistrationModal({
  modalOpen,
  setModalOpen,
  defaultCountry,
  countryWiseServices,
  allMyLeads,
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

  const [service, setService] = useState(null); // the selected service object
  const [searchTerm, setSearchTerm] = useState(''); // user-typed input string
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // const { data: allZipCodes, isLoading: isZipCodeLoading } =
  //   useGetZipCodeListQuery();

  // const zipCodeFromLead = allMyLeads[0]?.userProfileId?.address;
  // const matchedZip = allZipCodes?.data?.find(
  //   (z) => z.zipcode === zipCodeFromLead
  // );
  // // This is an _id
  // const [zipCode, setZipCode] = useState(matchedZip?._id || '');

  // const filteredZipCodes = allZipCodes?.data?.filter((item) =>
  //   item?.zipcode?.toLowerCase().includes(zipCode?.toLowerCase())
  // );

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

        setPostalCode(postal);
        setZipCode(place.formatted_address);
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

  // Still keep geocode fetch in case address changes without using autocomplete
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

          setPostalCode(postal);
          setZipCode(formattedAddress);
          setLatitude(coords.lat);
          setLongitude(coords.lng);
        }
      } catch (err) {
        console.error('Failed to fetch coordinates', err);
      }
    };

    fetchCoordinates();
  }, [address]);

  const addressInfo = {
    countryId: country.countryId,
    countryCode: country.code.toLowerCase(),
    zipcode: zipCode,
    latitude: latitude?.toString(),
    longitude: longitude?.toString(),
    postalCode,
  };

  console.log('addressInfo', addressInfo);

  const {
    data: selectedServiceWiseQuestions,
    isLoading: isQuestionsLoading,
    refetch,
  } = useGetServiceWiseQuestionsQuery(
    {
      countryId: defaultCountry?._id,
      serviceId: service?._id,
    },
    {
      skip: !defaultCountry?._id || !service?._id,
    }
  );

  useEffect(() => {
    if (!selectedServiceWiseQuestions?.data?.length) return;

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
  }, [selectedServiceWiseQuestions?.data]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const dispatch = useDispatch();
  const router = useRouter();

  //setting initial data

  useEffect(() => {
    setInitialData(selectedServiceWiseQuestions?.data);
  }, [selectedServiceWiseQuestions?.data]);

  useEffect(() => {
    if (clickButtonType === 'Next') {
      setSelectedOptions([]);
      setCheckedOptions([]);
      setCheckedOptionsDetails([]);
    }
  }, [step]);

  const totalQuestions = selectedServiceWiseQuestions?.data?.length;

  const totalFormsSteps = 3;

  const totalSteps = totalQuestions + totalFormsSteps;

  //cloning full with is_checked and isExtraData. This data is needed when previous step is clicked
  useEffect(() => {
    if (!selectedServiceWiseQuestions?.data?.length) return;

    const cloned = selectedServiceWiseQuestions?.data?.map((q) => ({
      ...q,
      options: q.options.map((opt) => ({
        ...opt,
        is_checked: false,
        idExtraData: '',
      })),
    }));

    setFullClonedQuestions(cloned);
  }, [selectedServiceWiseQuestions?.data]);

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

  const options = selectedServiceWiseQuestions?.data?.[step - 1]?.options || [];

  const handleOptionChange = (optionId, checked) => {
    const parentQuestion = fullClonedQuestions?.find((question) =>
      question.options?.some((option) => option._id === optionId)
    );

    const foundOption = parentQuestion?.options?.find(
      (option) => option._id === optionId
    );

    const questionType = parentQuestion?.questionType;

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

  //   useEffect(() => {
  //     if (step === 0) {
  //       partialClonedQuestions[step] = fullClonedQuestions?.[step];
  //       // setViewData(fullClonedQuestions?.[step]);
  //     } else {
  //       if (clickButtonType === 'Next') {
  //         partialClonedQuestions[step] = {
  //           ...partialClonedQuestions[step],
  //           options: selectedOptions,
  //         };
  //       }
  //       // setViewData(partialClonedQuestions?.[step]);
  //     }

  //     setViewData(partialClonedQuestions?.[step]);
  //   }, [step, partialClonedQuestions]);

  useEffect(() => {
    const updatedPartial = [...partialClonedQuestions];

    if (step === 0) {
      updatedPartial[step] = fullClonedQuestions?.[step - 1];
    } else if (clickButtonType === 'Next') {
      const fullStepData = fullClonedQuestions?.[step - 1];

      const mappedOptions = fullStepData?.options?.map((option) => {
        const isChecked = checkedOptions.includes(option._id);
        const extra = checkedOptionsDetails.find((o) => o.id === option._id);

        return {
          ...option,
          is_checked: isChecked,
          idExtraData: extra?.idExtraData || '',
        };
      });

      updatedPartial[step] = {
        ...fullStepData,
        options: mappedOptions,
      };
    } else if (clickButtonType === 'Prev') {
      updatedPartial[step] = fullClonedQuestions?.[step - 1];
    }

    setPartialClonedQuestions(updatedPartial);
    setViewData(updatedPartial?.[step]);
  }, [
    step,
    fullClonedQuestions,
    checkedOptions,
    checkedOptionsDetails,
    clickButtonType,
  ]);

  const [questionsPayload, setQuestionsPayload] = useState([]);

  const [addLead] = useCreateLeadMutation();

  //handleNext button click and form submission with api call
  const handleNext = async () => {
    const isFinalStep = step === totalSteps;
    const isQuestionStep = step > 0 && step <= totalQuestions;

    // Step 1: Handle question payload update
    if (isQuestionStep) {
      setQuestionsPayload((prev) => {
        const filtered = prev.filter((item) => item.step !== step);

        const questionIndex = step - 1;
        const questionId =
          selectedServiceWiseQuestions?.data?.[questionIndex]?._id;
        const question =
          selectedServiceWiseQuestions?.data?.[questionIndex]?.question;
        const order =
          selectedServiceWiseQuestions?.data?.[questionIndex]?.order;

        return [
          ...filtered,
          {
            step,
            questionId,
            question,
            order,
            checkedOptionsDetails: [...checkedOptionsDetails],
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

    const payload = {
      countryId: defaultCountry?._id,
      serviceId: service?._id,
      questions: [...questionsPayload], // ensure fresh snapshot
      leadPriority,
      additionalDetails,
      budgetAmount,
      addressInfo,
    };

    console.log('payload', payload);

    try {
      const res = await addLead(payload).unwrap();

      if (res?.success === true) {
        showSuccessToast(res?.message || 'Case registered successfully');
        setModalOpen(false);
        // Reset form
        setStep(0);
        setService(null);
        setZipCode(null);
        setSelectedOptions([]);
        setCheckedOptions([]);
        setCheckedOptionsDetails([]);
        setQuestionsPayload([]);
        setAddress('');
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

  const isNextDisabled = (() => {
    if (step === 0) {
      return !service || !zipCode;
    }

    if (step > 0 && step <= totalQuestions) {
      return checkedOptions.length === 0;
    }

    if (step === totalQuestions + 1) {
      return !leadPriority.trim();
    }

    if (step === totalQuestions + 2) {
      return !additionalDetails.trim();
    }

    if (step === totalQuestions + 3) {
      return !budgetAmount.trim();
    }

    return false;
  })();

  const filteredServices =
    searchTerm === ''
      ? countryWiseServices
      : countryWiseServices?.filter((service) =>
          service?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
        );

  return (
    <Modal
      open={modalOpen}
      onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          setViewData(null);
          setQuestionsPayload([]);
          setAdditionalDetails('');
          setBudgetAmount('');
          setService(null);
          setZipCode(null);
          setStep(0); // reset form steps, if needed
        }
      }}
      title=""
      width="max-w-[570px]"
      height="max-h-[90vh]"
    >
      {step === 0 ? (
        <>
          <h4 className="text-[24px] font-semibold text-center mb-8">
            Place a new request
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="" className="font-semibold">
                What service do you need?
              </label>
              <Combobox value={service} onChange={setService}>
                <div className="relative">
                  <ComboboxInput
                    className="border border-gray-300 rounded-md w-full h-[44px] px-4"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    displayValue={(val) => val?.name || ''}
                    placeholder="Select a service"
                  />
                  {filteredServices?.length > 0 && (
                    <ComboboxOptions className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {filteredServices?.map((service) => (
                        <ComboboxOption
                          key={service._id}
                          value={service} // 👈 Pass full object
                          className={({ active }) =>
                            cn(
                              'cursor-pointer select-none relative py-2 px-6',
                              active
                                ? 'bg-blue-100 text-black'
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
                                {service.name}
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
            <div className="space-y-2">
              <label htmlFor="" className="font-semibold">
                Where do you need it?
              </label>
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
          </div>
        </>
      ) : step > 0 && step <= totalQuestions ? (
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
                          checked={option?.is_checked || false}
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
      ) : step === totalQuestions + 1 ? (
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
      ) : step === totalQuestions + 2 ? (
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
      ) : step === totalSteps ? (
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
                value={country.currency}
                placeholder='currency i.e."AUD"'
                readOnly
              />
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`flex ${
          step === 0 ? 'justify-end' : 'justify-between'
        } mt-8`}
      >
        {/* Show "Back" only if step > 0 */}
        {step !== 0 && (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}

        {/* Show "Next" button on all steps */}
        <Button onClick={handleNext} disabled={isNextDisabled}>
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
    </Modal>
  );
}
