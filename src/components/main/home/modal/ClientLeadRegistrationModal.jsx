import React, { useState, useEffect, use } from 'react';
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

  // console.log(
  //   'selectedServiceWiseQuestions',
  //   selectedServiceWiseQuestions?.length
  // );

  //setting initial data

  useEffect(() => {
    setInitialData(selectedServiceWiseQuestions);
  }, [selectedServiceWiseQuestions]);

  //console.log('initialData', initialData);

  const totalQuestions = selectedServiceWiseQuestions?.length || 0;

  const totalForms = 3;

  const totalSteps = totalQuestions + totalForms;

  console.log('totalSteps', totalSteps);

  const [processedQuestions, setProcessedQuestions] = useState([]);

  //cloning full with is_checked and isExtraData. This data is needed when previous step is clicked

  useEffect(() => {
    if (selectedServiceWiseQuestions?.length > 0) {
      const cloned = selectedServiceWiseQuestions.map((q) => ({
        ...q,
        options: q.options.map((opt) => ({
          ...opt,
          is_checked: false,
          idExtraData: '',
        })),
      }));

      setFullClonedQuestions(cloned);
    }
  }, [selectedServiceWiseQuestions]);

  console.log('fullClonedQuestions', fullClonedQuestions);

  //partial cloning

  useEffect(() => {
    if (fullClonedQuestions?.length > 0) {
      const cloned = fullClonedQuestions.map(({ options, ...rest }) => ({
        ...rest,
        options: [], // or leave this out entirely if you don’t want `options` at all
      }));

      setPartialClonedQuestions(cloned);
    }
  }, [fullClonedQuestions]);

  console.log('partialClonedQuestions', partialClonedQuestions);

  //setting view data

  useEffect(() => {
    setViewData(fullClonedQuestions?.[step]);
  }, [fullClonedQuestions]);

  let currentQuestion = [];

  currentQuestion = processedQuestions?.[step];

  //console.log('currentQuestion', currentQuestion);

  const options = selectedServiceWiseQuestions?.[step]?.options || [];

  const handleOptionChange = (optionId, checked) => {
    // console.log('optionId', optionId);
    // console.log('checked', checked);

    setCheckedOptions((prev) => [...prev, optionId]);

    const findSelectedOptions = options?.find((item) => item?._id === optionId);

    //console.log('findSelectedOpitons', findSelectedOptions?.selected_options);

    if (checked) {
      setSelectedOptions((prev) => {
        const newOptions = findSelectedOptions?.selected_options || [];

        // Merge and filter out duplicates by _id (or any unique key)
        const combined = [...prev, ...newOptions];

        const unique = Array.from(
          new Map(combined.map((item) => [item._id, item])).values()
        );

        return unique;
      });
    }

    console.log('step', step);
    console.log('checkedOptions', checkedOptions);

    const updateCheckedOptionsAtStep = (step, checkedOptions) => {
      setPartialClonedQuestions((prevQuestions) => {
        if (!prevQuestions[step]) return prevQuestions; // Guard clause

        const updatedQuestions = [...prevQuestions];
        const updatedQuestion = { ...updatedQuestions[step] };

        // ✅ Set the options array to checkedOptions (IDs)
        updatedQuestion.options = checkedOptions;

        updatedQuestions[step] = updatedQuestion;
        return updatedQuestions;
      });
    };

    updateCheckedOptionsAtStep(step, checkedOptions);
  };

  console.log('checkedOptions', checkedOptions);
  console.log('selectedOptions', selectedOptions);

  const handleNext = () => {
    // ✅ Safely update processedQuestions
    const updatedQuestions = [...processedQuestions];

    updatedQuestions[step] = {
      ...updatedQuestions[step],
      options: checkedOptions,
    };

    setProcessedQuestions(updatedQuestions); // <-- important if it's from state

    // ✅ Move to next step *after* updating state
    setStep((prev) => prev + 1);

    // console.log('checkedOptions', checkedOptions);
    // console.log('updatedQuestion', updatedQuestions[step]);
  };

  return (
    <Modal open={open} onOpenChange={onClose} title="" width="max-w-[570px]">
      <div className="space-y-4 mt-4">
        <h4 className="text-[24px] font-semibold text-center mb-8">Question</h4>
        <div className="border border-1 flex flex-col gap-2 rounded-lg">
          {viewData && (
            <div className="space-y-4 mt-4">
              <h4 className="text-[24px] font-semibold text-center mb-8">
                {viewData?.question}
              </h4>
              <div className="border border-1 flex flex-col gap-2 rounded-lg">
                {viewData?.options?.map((option, index) => {
                  // const isChecked =
                  //   checkedOptions?.selected_options?.includes(option?._id) ||
                  //   false;
                  const isLast = index === viewData?.options?.length - 1;

                  return (
                    <label
                      key={option?._id}
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
                        checked={false}
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
          )}
        </div>
      </div>
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
          // disabled={step === totalSteps - 1 ? false : isNextDisabled}
        >
          Next{' '}
        </Button>
      </div>
    </Modal>
  );
}
