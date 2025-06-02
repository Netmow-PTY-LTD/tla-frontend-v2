'use client';
import React from 'react';
import PhotoGallery from './media/PhotoGallery';
import VideoGallery from './media/VideoGallery';
import FormWrapper from '@/components/form/FromWrapper';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import MediaFormAction from './media/MediaFormAction';
import { lawyerSettingsMediaFormSchema } from '@/schema/dashboard/lawyerSettings';

export default function Photos() {
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });
  const [updatePhotosData] = useUpdateUserDataMutation();

  const profile = userInfo?.data?.profile;
  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  if (isError) {
    return (
      <div className="text-red-500">
        <p>Error loading profile: {error.message}</p>
        <button
          onClick={refetch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const defaultValues = {
    video: profile?.photos?.video ?? '',
    photo: profile?.photos?.photo ?? '',
  };

  const handlePhotoUpload = async (data) => {
    console.log('Form data:', data);
    try {
      const formData = new FormData();
      const { photo, video } = data;
      const payload = {
        photos: {
          video: video ? video : '', // ✅ Wrap single value in an array
        },
      };

      // Append serialized JSON data
      formData.append('data', JSON.stringify(payload));

      // Conditionally append files
      if (photo instanceof File) {
        formData.append('photo', photo);
      }

      console.log(JSON.parse(formData.get('data')));
      const res = await updatePhotosData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || ' update successful');
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
        onSubmit={handlePhotoUpload}
        defaultValues={defaultValues}
        schema={lawyerSettingsMediaFormSchema}
      >
        <div className="flex flex-col gap-3">
          <PhotoGallery />
          <VideoGallery />
        </div>
        {/* Footer Buttons */}
        <MediaFormAction initialValues={defaultValues} />
      </FormWrapper>
    </div>
  );
}
