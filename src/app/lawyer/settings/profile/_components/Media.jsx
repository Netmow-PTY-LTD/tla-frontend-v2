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
import { Loader } from 'lucide-react';

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
  if (isLoading)
    return (
      <div>
        <span className="flex items-center justify-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          loading...
        </span>
      </div>
    );

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
    videos: profile?.photos?.videos.map((item) => ({ url: item })) ?? [],
    photos: profile?.photos?.photos ?? '',
  };

  // console.log('Default values:', defaultValues);
  const handlePhotoUpload = async (data) => {
    console.log('Form data:', data);

    try {
      const formData = new FormData();
      const { photos, videos } = data;

      const payload = {
        photos: {
          videos: videos?.map((item) => item.url) || [],
        },
      };

      // Add JSON payload to formData
      formData.append('data', JSON.stringify(payload));

      console.log('Payload before appending photos:', formData.getAll('data'));
      // Append multiple photos
      if (Array.isArray(photos)) {
        photos.forEach((file) => {
          if (file instanceof File) {
            formData.append('photos', file);
          }
        });
      } else if (photos instanceof File) {
        formData.append('photos', photos);
      }

      // ✅ Log files correctly
      console.log('Photo files:', formData.getAll('photos'));

      const res = await updatePhotosData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Update successful');
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
        // schema={lawyerSettingsMediaFormSchema}
      >
        <div className="flex flex-col gap-3 ">
          <PhotoGallery />
          <VideoGallery />
        </div>
        {/* Footer Buttons */}
        <MediaFormAction initialValues={defaultValues} />
      </FormWrapper>
    </div>
  );
}
