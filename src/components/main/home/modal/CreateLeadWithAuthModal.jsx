import React, { useState, useEffect, use, useMemo } from 'react';
import { Button } from '@/components/ui/button'; // adjust if your button import path differs
import { Modal } from '@/components/UIComponents/Modal';
import { Check, ChevronDown, Loader } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useCreateLeadMutation } from '@/store/features/client/LeadsApiService';
import { StartFrequencyOptions } from '@/data/data';

export default function CreateLeadWithAuthModal({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setQuestionLoading(false);
  }, [fullClonedQuestions]);

  //console.log('partialClonedQuestions', partialClonedQuestions);

  const options = selectedServiceWiseQuestions?.[step]?.options || [];

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

  const [createLead] = useCreateLeadMutation();

  //handleNext button click and form submission with api call
  const handleNext = async () => {
    const isFinalStep = step === totalSteps - 1;
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

    const payload = {
      countryId,
      serviceId,
      locationId,
      questions: [...questionsPayload],
      leadPriority,
      additionalDetails,
      budgetAmount,
    };

    console.log('🚀 Submitting payload:', payload);

    try {
      const res = await createLead(payload).unwrap();
      console.log('✅ Register response:', res);

      if (res?.success === true) {
        showSuccessToast(res?.message || 'Lead registered successfully');
        setModalOpen(false);
        setTimeout(() => {
          router.push('/client/dashboard/my-leads');
        }, 1000);
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

    if (step === totalSteps) {
      return !budgetAmount.trim();
    }

    // Step: Phone (optional)
    return false;
  })();

  return (
    <Modal
      open={modalOpen}
      onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          // setViewData(null);
          // setQuestionsPayload([]);
          setStep(0); // reset form steps, if needed
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
            <div className="border border-1 flex flex-col gap-2 rounded-lg max-h-[350px] overflow-y-auto">
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
      ) : step === totalSteps - 1 ? (
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
                value="AUD"
                placeholder='currency i.e."AUD"'
                readOnly
              />
            </div>
          </div>
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
              ) : step === totalSteps - 1 ? (
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
