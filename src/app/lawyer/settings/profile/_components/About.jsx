'use client';

import React from 'react';
import CompanyProfile from './about/CompanyProfile';
import PersonalProfile from './about/PersonalProfile';
import CompanyContactDetails from './about/CompanyContactDetails';
import CompanyLocation from './about/CompanyLocation';
import CompanyAbout from './about/CompanyAbout';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import FormWrapper from '@/components/form/FromWrapper';
import AboutFormActions from './about/AboutFormAction';

export default function About() {
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
    companyName: profile?.companyProfile?.companyName ?? '',
    name: profile?.name ?? '',
    contactEmail: profile?.companyProfile?.contactEmail ?? '',
    phoneNumber: profile?.companyProfile?.phoneNumber ?? '',
    website: profile?.companyProfile?.website ?? '',
    companySize: profile?.companyProfile?.companySize ?? '',
    description: profile?.companyProfile?.description ?? '',
    yearsInBusiness: profile?.companyProfile?.yearsInBusiness ?? '',
    companyLogo: profile?.companyProfile?.logoUrl ?? '', // URL string
    userProfileLogo: profile?.profilePicture ?? '', // URL string
    location: {
      address: profile?.companyProfile?.location?.address ?? '',
      hideFromProfile:
        profile?.companyProfile?.location?.hideFromProfile ?? false,
      locationReason: profile?.companyProfile?.location?.locationReason ?? '',
      coordinates: {
        lat: profile?.companyProfile?.location?.coordinates?.lat ?? null,
        lng: profile?.companyProfile?.location?.coordinates?.lng ?? null,
      },
    },
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const { name, companyLogo, userProfileLogo, ...rest } = data;
      const companyInfo = {
        companyName: rest.companyName,
        contactEmail: rest.contactEmail,
        phoneNumber: rest.phoneNumber,
        website: rest.website,
        companySize: rest.companySize,
        description: rest.description,
        yearsInBusiness: rest.yearsInBusiness,
        location: {
          address: rest.location.address,
          hideFromProfile: rest.location.hideFromProfile,
          locationReason: rest.location.locationReason,
          coordinates: {
            lat: rest.location.coordinates.lat,
            lng: rest.location.coordinates.lng,
          },
        },
      };

      const payload = {
        userProfile: {
          name,
        },
        companyInfo,
      };

      // Append serialized JSON data
      formData.append('data', JSON.stringify(payload));

      // Conditionally append files
      if (companyLogo instanceof File) {
        formData.append('companyLogo', companyLogo);
      }

      if (userProfileLogo instanceof File) {
        formData.append('userProfileLogo', userProfileLogo);
      }

      console.log(JSON.parse(formData.get('data')));
      const res = await updateUserData(formData)
        .unwrap()
        .then(() => {
          console.log('Profile updated successfully');
        })
        .catch((error) => {
          console.error('Failed to update profile:', error);
        });

      console.log('Update response:', res);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <FormWrapper onSubmit={onSubmit} defaultValues={defaultValues}>
        <div className="flex items-center gap-20  mb-5 ">
          <CompanyProfile />
          <PersonalProfile />
        </div>
        <div className="border-t border-white" />
        <CompanyContactDetails />
        <div className="border-t border-white" />
        <CompanyLocation />
        <div className="border-t border-white" />
        <CompanyAbout />
        <div className="border-t border-white" />
        {/* Footer Buttons */}
        <AboutFormActions />
      </FormWrapper>
    </div>
  );
}
