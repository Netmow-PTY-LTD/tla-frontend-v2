import React, { useState, useEffect } from 'react';
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
  isLoading,
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [clonedQuestions, setClonedQuestions] = useState([]);

  const totalSteps = selectedServiceWiseQuestions?.length + 4 || 0;
  const currentQuestion = dynamicQuestions?.[step];

  useEffect(() => {
    if (selectedServiceWiseQuestions?.length > 0) {
      const cloned = selectedServiceWiseQuestions.map((q, index) => ({
        ...q,
        options:
          index === 0
            ? q.options.map((opt) => ({
                ...opt,
                is_checked: false,
                idExtraData: '',
              }))
            : [],
      }));

      setClonedQuestions(cloned);
    }
  }, [selectedServiceWiseQuestions]);

  console.log('clonedQuestions', clonedQuestions);

  useEffect(() => {
    if (open) {
      setStep(0);
      setAnswers([]);
      setDynamicQuestions([...selectedServiceWiseQuestions]); // Clone initially
    }
  }, [open, selectedServiceWiseQuestions]);

  console.log('selectedServiceWiseQuestions', selectedServiceWiseQuestions);

  const options = selectedServiceWiseQuestions?.[step]?.options || [];

  const handleOptionChange = (optionId, checked) => {
    // console.log('optionId', optionId);
    // console.log('checked', checked);

    const findSelectedOptions = options?.find((item) => item?._id === optionId);

    //console.log('findSelectedOpitons', findSelectedOptions?.selected_options);

    if (checked) {
      setCheckedOptions((prev) => {
        const newOptions = findSelectedOptions?.selected_options || [];

        // Merge and filter out duplicates by _id (or any unique key)
        const combined = [...prev, ...newOptions];

        const unique = Array.from(
          new Map(combined.map((item) => [item._id, item])).values()
        );

        return unique;
      });
    }

    // const prevSelected = answers[step]?.selectedOptions || [];
    // let updatedSelected;

    // if (currentQuestion.questionType === 'checkbox') {
    //   updatedSelected = checked
    //     ? [...prevSelected, optionId]
    //     : prevSelected.filter((id) => id !== optionId);
    // } else {
    //   updatedSelected = [optionId]; // single select
    // }

    // const newAnswers = [...answers];
    // newAnswers[step] = {
    //   questionId: currentQuestion._id,
    //   question: currentQuestion.question,
    //   selectedOptions: updatedSelected,
    // };
    // setAnswers(newAnswers);
  };

  console.log('checkedOptions', checkedOptions);

  const isNextDisabled = (() => {
    const questionSteps = selectedServiceWiseQuestions.length;

    // Step: Questions (required) — check checkedOptions length instead of answers
    if (step < questionSteps) {
      return checkedOptions.length === 0;
    }

    // Step: Additional Details (optional)
    if (step === questionSteps) {
      return false;
    }

    // Step: ZIP Code (required)
    if (step === questionSteps + 1) {
      return !zipCode.trim();
    }

    // Step: Email (required and validated)
    if (step === questionSteps + 2) {
      return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Step: Phone (optional)
    return false;
  })();

  // const handleNext = () => {
  //   const selectedOptionIds = answers[step]?.selectedOptions || [];

  //   const selectedOptionObjects =
  //     currentQuestion?.options?.filter((opt) =>
  //       selectedOptionIds.includes(opt._id)
  //     ) || [];

  //   // Deduplicate selected_options
  //   const mergedSelectedOptions = [];
  //   const seen = new Set();

  //   selectedOptionObjects.forEach((opt) => {
  //     (opt.selected_options || []).forEach((selOpt) => {
  //       if (!seen.has(selOpt._id)) {
  //         seen.add(selOpt._id);
  //         mergedSelectedOptions.push(selOpt);
  //       }
  //     });
  //   });

  //   console.log('mergedSelectedOptions', mergedSelectedOptions);

  //   const newQuestions = [...dynamicQuestions];
  //   const nextIndex = step + 1;

  //   if (nextIndex < totalSteps) {
  //     newQuestions[nextIndex] = {
  //       ...newQuestions[nextIndex],
  //       options: mergedSelectedOptions,
  //     };
  //     setDynamicQuestions(newQuestions);
  //   }

  //   setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  // };

  const handleNext = () => {
    const nextIndex = step + 1;

    if (nextIndex < totalSteps) {
      const newQuestions = [...dynamicQuestions];

      newQuestions[nextIndex] = {
        ...newQuestions[nextIndex],
        options: checkedOptions,
      };

      setDynamicQuestions(newQuestions);
    }

    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const { data: allZipCodes, isLoading: isZipCodeLoading } =
    useGetZipCodeListQuery();

  // console.log('allZipCodes', allZipCodes?.data);

  const filteredZipCodes = allZipCodes?.data?.filter((item) =>
    item?.zipcode?.toLowerCase().includes(zipCode.toLowerCase())
  );

  return (
    <Modal open={open} onOpenChange={onClose} title="" width="max-w-[570px]">
      {isLoading ? (
        <div>Loading...</div>
      ) : step < selectedServiceWiseQuestions.length ? (
        // ✅ Service-related Questions step
        clonedQuestions && (
          <div className="space-y-4 mt-4">
            <h4 className="text-[24px] font-semibold text-center mb-8">
              {clonedQuestions?.question}
            </h4>
            <div className="border border-1 flex flex-col gap-2 rounded-lg">
              {clonedQuestions?.options?.map((option, index) => {
                const isChecked =
                  checkedOptions?.selected_options?.includes(option?._id) ||
                  false;
                const isLast = index === clonedQuestions?.options?.length - 1;

                return (
                  <label
                    key={option?._id}
                    className={`flex gap-3 items-center px-4 py-3 ${
                      !isLast ? 'border-b' : ''
                    }`}
                  >
                    <input
                      type={
                        currentQuestion.questionType === 'checkbox'
                          ? 'checkbox'
                          : 'radio'
                      }
                      name={`question-${currentQuestion._id}`}
                      checked={isChecked}
                      onChange={(e) =>
                        handleOptionChange(option._id, e.target.checked)
                      }
                    />
                    {option.name}
                  </label>
                );
              })}
            </div>
          </div>
        )
      ) : step === selectedServiceWiseQuestions.length ? (
        // ✅ Additional Details step
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
      ) : step === selectedServiceWiseQuestions.length + 1 ? (
        // ✅ ZIP Code step
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
      ) : step === selectedServiceWiseQuestions.length + 2 ? (
        // ✅ Email step
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
      ) : step === selectedServiceWiseQuestions.length + 3 ? (
        // ✅ Phone step
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
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            disabled={step === 0}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={step === totalSteps - 1 ? false : isNextDisabled}
          >
            {step === totalSteps - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      )}
    </Modal>
  );
}
