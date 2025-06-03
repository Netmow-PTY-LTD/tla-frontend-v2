'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';

import { CircleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function QuestionsAndAnswers() {
  const onCancel = () => console.log('Cancel clicked');

  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  const [updateUserData] = useUpdateUserDataMutation();
  const profile = userInfo?.data?.profile;

  //console.log('profile', profile);

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
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-base font-semibold text-black">Links</h2>
              <p className="text-sm text-[#8E8E8E] mt-2">
                Answer common questions to remove customer, reservations and
                doubt, bring them closer to making them hiring decision.
              </p>
            </div>
            <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
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
                />
                <p className="mt-2">Minimum 50 characters</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white mt-5" />
        {/* Footer Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onCancel}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]">
            Save
          </button>
        </div>
      </FormWrapper>
    </div>
  );
}
