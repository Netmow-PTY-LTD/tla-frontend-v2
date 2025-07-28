import React, { useState, useEffect, use, useMemo } from 'react';
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
import { StartFrequencyOptions } from '@/data/data';

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
  const [zipCode, setZipCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log(
  //   'selectedServiceWiseQuestions',
  //   selectedServiceWiseQuestions?.length
  // );

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

  const { data: allZipCodes, isLoading: isZipCodeLoading } =
    useGetZipCodeListQuery();

  const filteredZipCodes = allZipCodes?.data?.filter((item) =>
    item?.zipcode?.toLowerCase().includes(zipCode.toLowerCase())
  );

  useEffect(() => {
    if (locationId && allZipCodes?.data?.length > 0) {
      const matched = allZipCodes.data.find((item) => item._id === locationId);
      if (matched) {
        setZipCode(matched._id); // Set ID, not zipcode text
      }
    }
  }, [locationId, allZipCodes?.data]);

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

  //console.log('initialData', initialData);

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

  //console.log('partialClonedQuestions', partialClonedQuestions);

  const options = selectedServiceWiseQuestions?.[step]?.options || [];

  // const handleOptionChange = (optionId, checked) => {
  //   // find optionid from fullcloned

  //   // const foundOption = fullClonedQuestions
  //   //   ?.flatMap((question) => question.options || [])
  //   //   .find((option) => option?._id === optionId);

  //   // console.log('foundOption', foundOption);

  //   // const newCheckedOptions = checked
  //   //   ? [...checkedOptions, optionId]
  //   //   : checkedOptions.filter((id) => id !== optionId);

  //   // setCheckedOptions(newCheckedOptions);

  //   // const tempOption = {};

  //   // if (foundOption?.name === 'Other') {
  //   //   tempOption.id = optionId;
  //   //   tempOption.is_checked = true;
  //   //   tempOption.idExtraData = document.getElementById(
  //   //     `${optionId}-other`
  //   //   )?.value;
  //   // } else {
  //   //   tempOption.id = optionId;
  //   //   tempOption.is_checked = true;
  //   //   tempOption.idExtraData = '';
  //   // }

  //   // console.log('tempOption', tempOption);

  //   // setCheckedOptionsDetails([...checkedOptionsDetails, tempOption]);

  //   // console.log('checkedOptionsDetails', checkedOptionsDetails);

  //   // const foundOption = fullClonedQuestions
  //   //   ?.flatMap((question) => question.options || [])
  //   //   .find((option) => option?._id === optionId);

  //   // console.log('foundOption', foundOption);

  //   const parentQuestion = fullClonedQuestions?.find((question) =>
  //     question.options?.some((option) => option._id === optionId)
  //   );

  //   const foundOption = parentQuestion?.options?.find(
  //     (option) => option._id === optionId
  //   );

  //   const questionType = parentQuestion?.questionType;

  //   console.log('questionType', questionType);

  //   const newCheckedOptions = checked
  //     ? [...checkedOptions, optionId]
  //     : checkedOptions.filter((id) => id !== optionId);

  //   setCheckedOptions(newCheckedOptions);

  //   console.log('newCheckedOptions', newCheckedOptions);

  //   const tempOption = {
  //     id: optionId,
  //     name: foundOption?.name,
  //     is_checked: checked,
  //     idExtraData:
  //       foundOption?.name === 'Other'
  //         ? document.getElementById(`${optionId}-other`)?.value ?? ''
  //         : '',
  //   };

  //   setCheckedOptionsDetails((prev) => {
  //     if (checked) {
  //       const filtered = prev.filter((item) => item.id !== optionId);
  //       return [...filtered, tempOption];
  //     } else {
  //       return prev.filter((item) => item.id !== optionId);
  //     }
  //   });

  //   // Find selected options metadata (if needed for something else)
  //   const findSelectedOptions = options?.find((item) => item?._id === optionId);

  //   if (checked) {
  //     setSelectedOptions((prev) => {
  //       const newOptions = findSelectedOptions?.selected_options || [];

  //       // Merge and filter out duplicates by _id
  //       const combined = [...prev, ...newOptions];
  //       const unique = Array.from(
  //         new Map(combined.map((item) => [item._id, item])).values()
  //       );

  //       return unique;
  //     });
  //   }

  //   if (questionType === 'radio') {
  //     setCheckedOptions([optionId]);
  //     setCheckedOptionsDetails([tempOption]);
  //     setSelectedOptions(findSelectedOptions?.selected_options || []);
  //   }
  // };

  // console.log('selectedOptions', selectedOptions);
  // console.log('checkedOptions', checkedOptions);

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
      zipCode,
      name,
      email,
      phone,
    };

    const payload = {
      countryId,
      serviceId,
      questions: [...questionsPayload], // ensure fresh snapshot
      leadDetails,
    };

    console.log('🚀 Submitting payload:', payload);

    try {
      const res = await clientRegister(payload).unwrap();
      console.log('✅ Register response:', res);

      if (!res?.success || !res?.token) {
        showErrorToast(res?.message || 'Lead registration failed.');
        return;
      }

      showSuccessToast(res?.message || 'Lead registered successfully');

      const token = res.token;
      const userPayload = verifyToken(token);

      if (userPayload) {
        dispatch(setUser({ user: res?.data, token }));

        const userType = res?.data?.regUserType;

        setQuestionsPayload([]); // Clear form state
        setModalOpen(false); // Close modal

        if (userType === 'client') {
          setTimeout(() => {
            router.push('/client/dashboard/my-leads');
          }, 2000);
        } else {
          router.push('/');
        }
      } else {
        showErrorToast('Invalid token. Registration failed.');
      }
    } catch (err) {
      console.error('❌ Register error:', err);
      showErrorToast(err?.data?.message || 'Failed to register lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setClickButtonType('Prev');
  };

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
      return !zipCode.trim();
    }

    if (step === totalQuestions + 4) {
      return !name.trim();
    }

    // Step: Email (required and validated)
    if (step === totalQuestions + 5) {
      return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Step: Phone (optional)
    return false;
  })();

  console.log('isQuestionsLoading:', isQuestionsLoading);
  console.log('selectedServiceWiseQuestions:', selectedServiceWiseQuestions);
  console.log(
    '!selectedServiceWiseQuestions?.length:',
    !selectedServiceWiseQuestions?.length
  );

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
                value="USD"
                placeholder='currency i.e. "USD"'
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
          <Combobox value={zipCode} onChange={setZipCode}>
            <div className="relative">
              <ComboboxInput
                className="border border-gray-300 rounded-md w-full h-[44px] px-4"
                onChange={(event) => setZipCode(event.target.value)}
                displayValue={(val) =>
                  allZipCodes?.data?.find((z) => z._id === val)?.zipcode || val
                }
                placeholder="Select a Zipcode"
              />
              <ComboboxButton className="absolute top-0 bottom-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </ComboboxButton>
              {filteredZipCodes?.length > 0 && (
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {filteredZipCodes.map((item) => (
                    <ComboboxOption
                      key={item._id}
                      value={item._id}
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
