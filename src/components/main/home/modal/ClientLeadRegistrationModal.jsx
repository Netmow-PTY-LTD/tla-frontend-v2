import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // adjust if your button import path differs
import { Modal } from '@/components/UIComponents/Modal';

export default function ClientLeadRegistrationModal({
  open,
  onClose,
  selectedServiceWiseQuestions,
  isLoading,
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);

  const totalSteps = selectedServiceWiseQuestions?.length || 0;
  const currentQuestion = dynamicQuestions?.[step];

  useEffect(() => {
    if (open) {
      setStep(0);
      setAnswers([]);
      setDynamicQuestions([...selectedServiceWiseQuestions]); // Clone initially
    }
  }, [open, selectedServiceWiseQuestions]);

  const handleOptionChange = (optionId, checked) => {
    const prevSelected = answers[step]?.selectedOptions || [];
    let updatedSelected;

    if (currentQuestion.questionType === 'checkbox') {
      updatedSelected = checked
        ? [...prevSelected, optionId]
        : prevSelected.filter((id) => id !== optionId);
    } else {
      updatedSelected = [optionId]; // single select
    }

    const newAnswers = [...answers];
    newAnswers[step] = {
      questionId: currentQuestion._id,
      question: currentQuestion.question,
      selectedOptions: updatedSelected,
    };
    setAnswers(newAnswers);
  };

  const isNextDisabled = !(answers[step]?.selectedOptions?.length > 0);

  const handleNext = () => {
    const selectedOptionIds = answers[step]?.selectedOptions || [];

    const selectedOptionObjects =
      currentQuestion?.options?.filter((opt) =>
        selectedOptionIds.includes(opt._id)
      ) || [];

    // Deduplicate selected_options
    const mergedSelectedOptions = [];
    const seen = new Set();

    selectedOptionObjects.forEach((opt) => {
      (opt.selected_options || []).forEach((selOpt) => {
        if (!seen.has(selOpt._id)) {
          seen.add(selOpt._id);
          mergedSelectedOptions.push(selOpt);
        }
      });
    });

    console.log('mergedSelectedOptions', mergedSelectedOptions);

    const newQuestions = [...dynamicQuestions];
    const nextIndex = step + 1;

    if (nextIndex < totalSteps) {
      newQuestions[nextIndex] = {
        ...newQuestions[nextIndex],
        options: mergedSelectedOptions,
      };
      setDynamicQuestions(newQuestions);
    }

    setStep((prev) => prev + 1);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Client Lead Registration"
      width="max-w-[570px]"
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : currentQuestion ? (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">{currentQuestion.question}</h4>

          {currentQuestion.options?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {currentQuestion.options.map((option) => {
                const isChecked =
                  answers[step]?.selectedOptions?.includes(option._id) || false;
                return (
                  <label key={option._id} className="flex items-center gap-2">
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
          ) : (
            <div className="text-sm text-red-500">
              No options available for this question.
            </div>
          )}
        </div>
      ) : (
        <div>No questions found.</div>
      )}

      {!isLoading && (
        <div className="flex justify-between mt-6">
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
