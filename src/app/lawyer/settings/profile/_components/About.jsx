'use client';

import React, { useMemo, useState } from 'react';
import CompanyProfile from './about/company/CompanyProfile';
import PersonalProfile from './about/PersonalProfile';
import CompanyAbout from './about/company/CompanyAbout';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import FormWrapper from '@/components/form/FromWrapper';
import AboutFormActions from './about/AboutFormAction';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { lawyerSettingAboutSchema } from '@/schema/dashboard/lawyerSettings';
import TextInput from '@/components/form/TextInput';
import { AirVent, Loader } from 'lucide-react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import ChangePassword from '@/app/client/_components/ChangePassword';
import GenderRadioField from '@/components/form/GenderRadioField';
import MultiTagSelector from './MultiTagSelector';
import AddressCombobox from '@/app/client/_components/profile/AddressCombobox';
import ChangeEmail from '@/app/client/_components/ChangeEmail';
import CompanyLocation from './about/company/CompanyLocation';
import Company from './about/company/Company';
import { useGetCompanyListQuery } from '@/store/features/public/publicApiService';
import CompanySelectField from './about/company/CompanySelectField';
import { Button } from '@/components/ui/button';
import { useCancelLawyerMembershipMutation } from '@/store/features/lawyer/LeadsApiService';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';

export default function About() {
  const [open, setOpen] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [isOpenRew, setIsOpenRew] = useState(false);
  const [showCompanyFields, setShowCompanyFields] = useState(false);
  const [query, setQuery] = useState('');
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  const [updateUserData, { isLoading: userIsLoading }] =
    useUpdateUserDataMutation();
  const profile = userInfo?.data?.profile;
  const [cancelLawyerMembership] = useCancelLawyerMembershipMutation();

  console.log('profile', profile);

  const defaultValues = useMemo(
    () => ({
      companyName: profile?.firmProfileId?.firmName ?? '',
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

      // ✅ moved to firmProfileId
      contactEmail: profile?.firmProfileId?.contactInfo?.email ?? '',
      phoneNumber: profile?.firmProfileId?.contactInfo?.phone ?? '',
      website: profile?.firmProfileId?.contactInfo?.officialWebsite ?? '',
      companySize: profile?.firmProfileId?.companySize ?? '',
      description: profile?.firmProfileId?.description ?? '',
      yearsInBusiness: profile?.firmProfileId?.yearsInBusiness ?? '',
      companyLogo: profile?.firmProfileId?.logo ?? '', // firm logo
      userProfileLogo: profile?.profilePicture ?? '', // user profile pic

      companyAddress: profile?.firmProfileId?.contactInfo?.zipCode
        ? {
            value: profile.firmProfileId.contactInfo.zipCode._id,
            label: profile.firmProfileId.contactInfo.zipCode.zipcode,
          }
        : null,
    }),
    [profile]
  );

  const { data: allCompanies, isLoading: isCompanyLoading } =
    useGetCompanyListQuery(
      {
        countryId: profile?.country ?? '',
        search: query || '',
      },
      {
        skip: !profile?.country,
      }
    );

  const filteredCompanies = useMemo(() => {
    if (!allCompanies?.data) return [];
    if (query.length < 3) return [];
    const q = query.toLowerCase();
    return allCompanies.data.filter((company) =>
      company?.firmName?.toLowerCase()?.includes(q)
    );
  }, [query, allCompanies]);

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

      const companyInfo = showCompanyFields
        ? {
            firmProfileId: data.firmProfileId ?? '',
          }
        : {};

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
        companyInfo: companyInfo || undefined,
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
      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'update successful');
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

  // Add a function to handle the cancel request logic
  const handleCancelRequest = async (firmProfileId) => {
    console.log('Cancelling request for firmProfileId:', firmProfileId);
    try {
      // Assuming there's an API endpoint to cancel the request
      const response = await cancelLawyerMembership({ firmProfileId }).unwrap();

      if (response?.success) {
        showSuccessToast(response?.message || 'Request cancelled successfully');
        refetch(); // Refresh the data to reflect the changes
      } else {
        throw new Error(response?.message || 'Failed to cancel the request');
      }
    } catch (error) {
      showErrorToast(
        error.message || 'An error occurred while cancelling the request'
      );
    }
  };

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

          <SimpleEditor name="bio" />
        </div>

        <div className="border-t border-white" />

        <div className="mt-6">
          {profile?.isFirmMemberRequest &&
          profile?.activeFirmRequestId?.firmProfileId !== null ? (
            <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-6 text-sm text-yellow-800 mt-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-yellow-900">
                  Firm Requested:{' '}
                  {profile?.activeFirmRequestId?.firmProfileId?.firmName}
                </h3>
                <p className="flex items-center gap-2 text-base leading-relaxed">
                  <span className="text-2xl">🕓</span>
                  Your request to join this firm is currently
                  <span className="font-medium">pending approval</span>.
                </p>
                <Button
                  className="self-start bg-[#00C3C0] text-white px-5 py-2 text-sm font-medium rounded-md hover:bg-[#009a98] transition-all duration-300 shadow-md"
                  onClick={() => setIsOpenRew(true)}
                >
                  Cancel Request
                </Button>
              </div>
            </div>
          ) : !profile?.firmProfileId || profile?.firmProfileId === null ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Add Company Profile
              </label>

              <div className="flex items-center gap-3 mb-5">
                <input
                  type="checkbox"
                  id="addCompanyProfile"
                  onChange={(e) => setShowCompanyFields(e.target.checked)}
                  className="h-5 w-5 cursor-pointer accent-[#00C3C0]"
                />
                <label
                  htmlFor="addCompanyProfile"
                  className="cursor-pointer text-gray-700 text-sm"
                >
                  Check to add company details
                </label>
              </div>

              {showCompanyFields && (
                <div className="mt-4">
                  <CompanySelectField
                    name="firmProfileId"
                    allCompanies={filteredCompanies}
                    query={query}
                    isLoading={isCompanyLoading}
                    setQuery={setQuery}
                    label="Select Company"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6">
              <Company companyInfo={profile?.firmProfileId} />
            </div>
          )}
        </div>

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

        <ConfirmationModal
          onConfirm={() =>
            handleCancelRequest(
              profile?.activeFirmRequestId?.firmProfileId?._id
            )
          }
          open={isOpenRew}
          onOpenChange={setIsOpenRew}
          description="Are you sure you want to cancel your request to join this firm?"
        />
      </>
    </div>
  );
}
