'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
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
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { lawyerSettingAboutSchema } from '@/schema/dashboard/lawyerSettings';
import TextInput from '@/components/form/TextInput';
import TextareaInput from '@/components/form/TextArea';
import { Loader } from 'lucide-react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Button } from '@/components/ui/button';
import ChangePassword from '@/app/client/_components/ChangePassword';
import { Label } from '@/components/ui/label';
import { useFormContext, useWatch } from 'react-hook-form';
import GenderRadioField from '@/components/form/GenderRadioField';
import MultiTagSelector from './MultiTagSelector';
import country from '@/data/au.json';
import AddressCombobox from '@/app/client/_components/profile/AddressCombobox';
import ChangeEmail from '@/app/client/_components/ChangeEmail';

const genderOptions = [
  { id: 1, label: 'Male', value: 'male' },
  { id: 2, label: 'Female', value: 'female' },
  { id: 3, label: 'Other', value: 'other' },
];

export default function About() {
  const [zipCode, setZipCode] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [postalCode, setPostalCode] = useState('');

  const [open, setOpen] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);

  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  console.log('userInfo', userInfo);

  const [updateUserData, { isLoading: userIsLoading }] =
    useUpdateUserDataMutation();
  const profile = userInfo?.data?.profile;

  useEffect(() => {
    if (profile?.companyProfile) {
      setShowCompanyProfile(!!profile?.companyProfile);
    }
  }, [profile?.companyProfile]);

  console.log('showCompanyProfile', showCompanyProfile);

  const defaultValues = useMemo(
    () => ({
      companyName: profile?.companyProfile?.companyName ?? '',
      name: profile?.name ?? '',
      designation: profile?.designation ?? '',
      languages: profile?.languages ?? [],
      address: profile?.address ?? '',
      phone: profile?.phone ?? '',
      gender: profile?.gender ?? '',
      law_society_member_number: profile?.law_society_member_number ?? '',
      practising_certificate_number:
        profile?.practising_certificate_number ?? '',
      bio: profile?.bio ?? '',
      lawyerContactEmail: profile?.lawyerContactEmail ?? '',
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
          lat: profile?.companyProfile?.location?.coordinates?.lat ?? 0,
          lng: profile?.companyProfile?.location?.coordinates?.lng ?? 0,
        },
      },
    }),
    [profile]
  );

  const onSubmit = async (data) => {
    console.log('data', data);
    try {
      const formData = new FormData();
      const {
        name,
        designation,
        languages,
        address,
        phone,
        gender,
        law_society_member_number,
        practising_certificate_number,
        bio,
        lawyerContactEmail,
        companyLogo,
        userProfileLogo,
        ...rest
      } = data;

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
            lat: rest.location?.coordinates?.lat,
            lng: rest.location?.coordinates?.lng,
          },
        },
        addressInfo: {
          countryId: country.countryId,
          zipcode: zipCode,
          countryCode: country.code.toLowerCase(),
          latitude: latitude?.toString() || '',
          longitude: longitude?.toString() || '',
          postalCode,
        },
      };

      const payload = {
        userProfile: {
          name,
          designation,
          languages,
          address,
          phone,
          gender,
          law_society_member_number,
          practising_certificate_number,
          bio,
          lawyerContactEmail,
        },
        companyInfo: showCompanyProfile ? companyInfo : null,
      };

      console.log('payload', payload);

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
      const res = await updateUserData(formData).unwrap();
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
      <div className="flex items-center justify-center ">
        <div className="text-red-500 ">
          <p>Error loading profile: {error.message}</p>
          <button
            onClick={refetch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[900px] mx-auto">
      <FormWrapper
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={lawyerSettingAboutSchema}
      >
        <PersonalProfile />

        <div className="border-t border-white" />

        <div className="pt-5 pb-5">
          <h3 className="text-black font-semibold heading-lg">
            Professional Details
          </h3>
          <p className="mt-[10px] text-[#8E8E8E] mb-7">
            Showcase your legal experience, qualifications, and areas of
            expertise. This information appears on your public profile and helps
            build trust with potential clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-7">
            <TextInput
              label="Law Society Member Number"
              name="law_society_member_number"
              textColor="text-[#4b4949]"
            />
            <TextInput
              label="Practising Certificate Number"
              name="practising_certificate_number"
              textColor="text-[#4b4949]"
            />
          </div>
        </div>
        <div className="border-t border-white" />

        {/* Personal Contact Info */}
        <div className="py-9">
          <h3 className="text-black font-semibold heading-lg">About</h3>
          <p className="mt-[10px] text-[#8E8E8E] mb-7">
            This section appears on your public profile on TheLawApp and is your
            opportunity to make a strong first impression. Use it to highlight
            your legal experience, areas of expertise, and what sets you apart.
            Building trust starts with a clear, professional introduction.
          </p>

          <MultiTagSelector name="languages" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-7 mb-7">
            <TextInput
              label="Phone Number"
              name="phone"
              placeholder="+8801XXXXXXX"
              textColor="text-[#4b4949]"
            />
            {/* <TextInput
              label="Address"
              name="address"
              placeholder="Enter your personal address"
              textColor="text-[#4b4949]"
            /> */}
            <AddressCombobox />
            <TextInput
              label="Contact Email"
              name="lawyerContactEmail"
              placeholder="contact@gmail.com"
              textColor="text-[#4b4949]"
            />
            <GenderRadioField />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 mt-7 text-sm font-medium text-[#00C3C0] border border-[#00C3C0] rounded-md hover:bg-[#00C3C0] hover:text-white transition-all duration-300"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={() => setOpenEmail(true)}
              className="inline-flex items-center justify-center px-4 py-2 mt-7 text-sm font-medium text-[#00C3C0] border border-[#00C3C0] rounded-md hover:bg-[#00C3C0] hover:text-white transition-all duration-300"
            >
              Change Email
            </button>
          </div>
          <label className="text-black label-text mb-3 inline-block">
            About You
          </label>
          {/* <TextareaInput
            label="About You"
            name="bio"
            placeholder="Tell us about your experience, what makes you stand out, or how you help your clients."
          /> */}
          <SimpleEditor name="bio" />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="showCompanyProfile"
            checked={showCompanyProfile}
            onChange={(e) => setShowCompanyProfile(e.target.checked)}
          />
          <label htmlFor="showCompanyProfile" className="text-sm">
            Add company information
          </label>
        </div>

        {showCompanyProfile && (
          <>
            <div className="border-t border-white" />
            <CompanyProfile />
            <div className="border-t border-white" />
            <CompanyLocation
              setZipCode={setZipCode}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setPostalCode={setPostalCode}
            />
            <div className="border-t border-white" />
            <CompanyAbout />
          </>
        )}

        <div className="border-t border-white" />
        {/* Footer Buttons */}
        <AboutFormActions
          isLoading={userIsLoading}
          initialValues={defaultValues}
        />
      </FormWrapper>
      <>
        <ChangePassword setOpen={setOpen} open={open} />
        <ChangeEmail setOpen={setOpenEmail} open={openEmail} />
      </>
    </div>
  );
}
