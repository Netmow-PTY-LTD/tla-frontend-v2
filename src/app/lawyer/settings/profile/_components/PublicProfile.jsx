'use client';

import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import { useState } from 'react';
import { Loader } from 'lucide-react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import FormWrapper from '@/components/form/FromWrapper';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import AboutFormActions from './about/AboutFormAction';
import TextInput from '@/components/form/TextInput';

export default function PublicProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });
  const [updateUserData, { isLoading: experienceIsLoading }] =
    useUpdateUserDataMutation();

  if (isLoading)
    return (
      <div>
        <span className="flex items-center justify-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          loading...
        </span>
      </div>
    );

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const profile = userInfo?.data?.profile;

  const defaultValues = {
    years: profile?.experience?.years ?? '',
    months: profile?.experience?.months ?? '',
    experience: profile?.experience?.experience ?? '',
    experienceHighlight: profile?.experience?.experienceHighlight ?? '',
  };

  const handleSubmit = async (values) => {
    console.log('Submitting values:', values);
    const { years, months, experience, experienceHighlight } = values;

    const payload = {
      experience: {
        years,
        months,
        experience,
        experienceHighlight,
      },
    };

    //console.log('Submitting payload:', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    try {
      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Service updated successfully');
        refetch();
      }
      console.log('Update response:', res);
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="max-w-[900px] mx-auto">
      <FormWrapper onSubmit={handleSubmit} defaultValues={defaultValues}>
        <h3 className="text-black font-semibold heading-lg">
          Year of Experience
        </h3>
        <p className="mt-[10px] mb-8 text-[#6e6e6e]">
          Clearly describe your areas of legal practice and past experience —
          providing specific details helps clients feel assured they’re choosing
          a knowledgeable and capable lawyer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-7">
          <TextInput
            type="number"
            label="Years"
            name="years"
            textColor="text-[#4b4949]"
          />
          <TextInput
            type="number"
            label="Months"
            name="months"
            textColor="text-[#4b4949]"
          />
        </div>
        <div>
          <h3 className="text-black font-semibold heading-lg">Experiences</h3>
          <p className="mt-[10px] mb-8 text-[#6e6e6e]">
            Clearly describe your areas of legal practice and past experience —
            providing specific details helps clients feel assured they’re
            choosing a knowledgeable and capable lawyer.
          </p>
          <SimpleEditor name="experience" />
        </div>
        <div>
          <h3 className="text-black font-semibold heading-lg mt-[50px]">
            Career Highlights
          </h3>
          <p className="mt-[10px] mb-8 text-[#6e6e6e]">
            Highlight major accomplishments in your legal career — from
            successful case outcomes to leadership roles and professional
            recognitions, these details help clients feel confident in choosing
            your services.
          </p>
          <SimpleEditor name="experienceHighlight" />
        </div>

        <AboutFormActions
          isLoading={experienceIsLoading}
          initialValues={defaultValues}
        />
      </FormWrapper>
    </div>
  );
}
