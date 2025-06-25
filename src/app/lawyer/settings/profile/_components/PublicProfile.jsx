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
  const [updateUserData] = useUpdateUserDataMutation();

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
    experience: profile?.experience?.experience ?? '',
    experienceHighlight: profile?.experience?.experienceHighlight ?? '',
  };

  const handleSubmit = async (values) => {
    console.log('Submitting values:', values);
    const { experience, experienceHighlight } = values;

    const payload = {
      experience: {
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
        <h3 className="text-black font-semibold heading-lg">Experiences</h3>
        <p className="mt-[5px] mb-5">
          Include all experiences you offer in some detail to give customers the
          confidence they’re looking for when making a hiring decision.
        </p>
        <SimpleEditor name="experience" />
        <h3 className="text-black font-semibold heading-lg">
          Career Highlights
        </h3>
        <p className="mt-[5px] mb-5">
          Include all experience highlights you offer in some detail to give
          customers the confidence they’re looking for when making a hiring
          decision.
        </p>
        <SimpleEditor name="experienceHighlight" />
        <div className="flex justify-between items-center pt-4 ">
          <button className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]">
            Save
          </button>
        </div>
      </FormWrapper>
      {/* <div
        dangerouslySetInnerHTML={{ __html: profile.experience.experience }}
        className="prose prose-sm prose-headings:font-semibold prose-ul:list-disc prose-li:marker:text-black prose-p:text-gray-800"
      >
      </div> */}
    </div>
  );
}
