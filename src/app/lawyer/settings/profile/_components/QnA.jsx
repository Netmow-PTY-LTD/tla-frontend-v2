'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';

import { CircleAlert, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AboutFormActions from './about/AboutFormAction';

export default function QuestionsAndAnswers() {
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  const [updateUserData, { isLoading: qaIsLoading }] =
    useUpdateUserDataMutation();

  const [defaultValues, setDefaultValues] = useState({
    profileQA: [
      { question: 'What do you love most about your job?', answer: '' },
      { question: 'What inspired you to start your own business?', answer: '' },
      { question: 'Why should our clients choose you?', answer: '' },
      {
        question: 'Can you provide your services online or remotely?',
        answer: '',
      },
    ],
  });

  const profile = userInfo?.data?.profile;

  useEffect(() => {
    if (profile?.profileQA) {
      setDefaultValues({
        profileQA: defaultValues.profileQA.map((qa) => ({
          question: qa.question,
          answer:
            profile.profileQA.find((item) => item.question === qa.question)
              ?.answer || '',
        })),
      });
    }
  }, [profile]);

  if (isLoading)
    return (
      <div>
        <span className="flex items-center justify-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          loading...
        </span>
      </div>
    );

  const handleSubmit = async (values) => {
    const payload = {
      profileQA: values.profileQA.map((item, index) => ({
        question: defaultValues.profileQA[index].question,
        answer: item.answer,
      })),
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    try {
      const res = await updateUserData(formData).unwrap();
      if (res?.success) {
        showSuccessToast(res.message || 'Answers updated successfully');
        refetch();
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'An error occurred');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <FormWrapper
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        key={JSON.stringify(defaultValues)}
      >
        {/* Links Section */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h3 className="heading-lg font-semibold text-black">
                Question & Answer
              </h3>
              <p className="text-sm text-[#6e6e6e] mt-2">
                Provide clear answers to common legal questions — resolving
                doubts about your services or approach brings potential clients
                closer to making an informed hiring decision.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
              <CircleAlert className="w-4 h-4" />
              <span>Optional</span>
              {/* <ToggleSwitch onToggle={handleToggle} /> */}
            </div>
          </div>

          <div className="space-y-5 mt-5">
            {defaultValues.profileQA.map((qa, index) => (
              <div key={index}>
                <TextareaInput
                  label={qa.question}
                  name={`profileQA[${index}].answer`}
                  placeholder="Write your answer..."
                  textColor="text-[#4b4949]"
                />
                <p className="mt-2">Minimum 50 characters</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white mt-5" />
        {/* Footer Buttons */}
        <AboutFormActions
          isLoading={qaIsLoading}
          initialValues={defaultValues}
        />
      </FormWrapper>
    </div>
  );
}
