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
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClientLeadRegistrationModal({
  open,
  onClose,
  selectedServiceWiseQuestions,
  countryId,
  serviceId,
  isLoading,
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

  //selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [clickButtonType, setClickButtonType] = useState('Next');

  const [additionalDetails, setAdditionalDetails] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // console.log(
  //   'selectedServiceWiseQuestions',
  //   selectedServiceWiseQuestions?.length
  // );

  //setting initial data

  useEffect(() => {
    setInitialData(selectedServiceWiseQuestions);
  }, [selectedServiceWiseQuestions]);

  useEffect(() => {
    if (clickButtonType === 'Next') {
      setSelectedOptions([]);
      setCheckedOptions([]);
    }
  }, [step]);

  //console.log('initialData', initialData);

  const totalQuestions = selectedServiceWiseQuestions?.length;

  const totalFormsSteps = 3;

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
  }, [fullClonedQuestions]);

  //console.log('partialClonedQuestions', partialClonedQuestions);

  const options = selectedServiceWiseQuestions?.[step]?.options || [];

  const handleOptionChange = (optionId, checked) => {
    // Compute the new checkedOptions immediately
    const newCheckedOptions = checked
      ? [...checkedOptions, optionId]
      : checkedOptions.filter((id) => id !== optionId);

    setCheckedOptions(newCheckedOptions);

    // Find selected options metadata (if needed for something else)
    const findSelectedOptions = options?.find((item) => item?._id === optionId);

    if (checked) {
      setSelectedOptions((prev) => {
        const newOptions = findSelectedOptions?.selected_options || [];

        // Merge and filter out duplicates by _id
        const combined = [...prev, ...newOptions];
        const unique = Array.from(
          new Map(combined.map((item) => [item._id, item])).values()
        );

        return unique;
      });
    }
  };

  // console.log('selectedOptions', selectedOptions);
  // console.log('checkedOptions', checkedOptions);

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

  console.log('partialClonedQuestions', partialClonedQuestions);

  const [questionsPayload, setQuestionsPayload] = useState([]);

  let formsPayload = {};

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
      setClickButtonType('Next');
    } else if (step === totalSteps) {
      formsPayload = {
        additionalDetails,
        zipCode,
        email,
        phone,
      };
    }

    if (step < totalQuestions) {
      setQuestionsPayload((prev) => {
        const filtered = prev.filter((item) => item.step !== step);

        const questionId = selectedServiceWiseQuestions?.[step]?._id;
        const question = selectedServiceWiseQuestions?.[step]?.question;

        return [
          ...filtered,
          {
            step,
            questionId,
            question,
            checkedOptions,
          },
        ];
      });
    }

    const payload = {
      countryId,
      serviceId,
      questions: questionsPayload,
      formdata: formsPayload,
    };

    console.log('payload', payload);
  };

  useEffect(() => {
    console.log('Updated questionsPayload:', questionsPayload);
  }, [questionsPayload]);

  console.log('viewdata', viewData);

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
      return false;
    }

    // Step: ZIP Code (required)
    if (step === totalQuestions + 1) {
      return !zipCode.trim();
    }

    // Step: Email (required and validated)
    if (step === totalQuestions + 2) {
      return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Step: Phone (optional)
    return false;
  })();

  const { data: allZipCodes, isLoading: isZipCodeLoading } =
    useGetZipCodeListQuery();

  // console.log('allZipCodes', allZipCodes?.data);

  const filteredZipCodes = allZipCodes?.data?.filter((item) =>
    item?.zipcode?.toLowerCase().includes(zipCode.toLowerCase())
  );

  console.log('selectedServiceWiseQuestions', selectedServiceWiseQuestions);

  return (
    <Modal open={open} onOpenChange={onClose} title="" width="max-w-[570px]">
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : step < totalQuestions ? (
        viewData?.question ? (
          <div className="space-y-4 mt-4">
            <h4 className="text-[24px] font-semibold text-center mb-8">
              {viewData.question}
            </h4>
            <div className="border border-1 flex flex-col gap-2 rounded-lg">
              {viewData.options?.map((option, index) => {
                const isLast = index === viewData.options.length - 1;

                return (
                  <label
                    key={option._id || index}
                    className={`flex gap-3 items-center px-4 py-3 ${
                      !isLast ? 'border-b' : ''
                    }`}
                  >
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
                    {option?.name}
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
            Want to share anything more?
          </h4>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Additional Details (Optional)
            </span>
            <textarea
              className="border rounded px-3 py-2 min-h-[100px]"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Provide any specific info or instructions for the service..."
            />
          </label>
        </div>
      ) : step === totalQuestions + 1 ? (
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
      ) : step === totalQuestions + 2 ? (
        <div className="text-center text-gray-500 mt-4">
          {' '}
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

      {!isLoading && (
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
            disabled={step === totalSteps ? false : isNextDisabled}
          >
            {step === totalSteps ? 'Finish' : 'Next'}
          </Button>
        </div>
      )}
    </Modal>
  );
}
