'use client';
import React from 'react';
import SocialMediaLink from './social-media/SocialMediaLink';
import ExternalLinks from './social-media/ExternalLinks';
import FormWrapper from '@/components/form/FromWrapper';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { z } from 'zod';
import { Loader } from 'lucide-react';

export default function SocialMediaLinks() {
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  //const onSave = () => console.log('Save clicked');

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
  const profile = userInfo?.data?.profile;

  const onCancel = () => {
    console.log('Cancel clicked');
    //reset(originalValues);
  };

  const socialMediaSchema = z.object({
    facebook: z.string().url('Invalid Facebook URL').optional(),
    twitter: z.string().url('Invalid Twitter URL').optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')), // Allow empty string as valid input
  });

  const defaultValues = {
    facebook: profile?.socialMedia?.facebook ?? '',
    twitter: profile?.socialMedia?.twitter ?? '',
    website: profile?.socialMedia?.website ?? '',
  };

  const handleSubmit = async (data) => {
    console.log('social media', data);
    try {
      const formData = new FormData();
      const { facebook, twitter, website } = data;
      const socialMediaInfo = {
        facebook: facebook,
        twitter: twitter,
        website: website,
      };

      const payload = {
        socialMediaInfo,
      };

      // Append serialized JSON data
      formData.append('data', JSON.stringify(payload));

      console.log(JSON.parse(formData.get('data')));
      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(
          res?.message || 'Social media info updated successfully'
        );
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
      <FormWrapper
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        schema={socialMediaSchema}
      >
        <div className="flex flex-col gap-3">
          <SocialMediaLink profile={profile} />
          {/* <ExternalLinks /> */}
          {/* Footer Buttons */}
          <div className="border-t border-white mt-5" />
          <div className="flex justify-between items-center pt-4 ">
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
        </div>
      </FormWrapper>
    </div>
  );
}
