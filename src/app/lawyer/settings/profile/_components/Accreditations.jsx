'use client';

import React, { useState } from 'react';
import AccreditationsList from './accreditations/AccreditationsList';
import { CircleAlert, Loader } from 'lucide-react';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import EditAccreditationFormModal from './accreditations/EditAccreditationFormModal';
import AddAccreditationModal from './accreditations/AddAccreditationModal';

export default function Accreditations() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccreditation, setSelectedAccreditation] = useState(null);
  const [open, setOpen] = useState(false);

  const handleEditClick = (accreditation) => () => {
    console.log('accreditation', accreditation);
    setSelectedAccreditation(accreditation);
    setIsEditModalOpen(true);
  };

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

  //const onSave = () => console.log('Save clicked');

  const profile = userInfo?.data?.profile;

  const defaultValues = {
    institution: profile?.accreditation?.institution,
    address: profile?.accreditation?.address,
    certificate_title: profile?.accreditation?.certificate_title,
    attachment: profile?.accreditation?.attachment,
  };

  const handleSubmit = async (values) => {
    console.log('Form values:', values);
    const { institution, address, certificate_title, attachment } = values;

    const payload = {
      accreditationInfo: {
        institution,
        address,
        certificate_title,
      },
    };

    console.log('payload', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    if (attachment && attachment[0] instanceof File) {
      formData.append('attachment', attachment[0]);
    }

    console.log('data', JSON.parse(formData?.get('data')));

    try {
      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(
          res?.message || 'Social media info updated successfully'
        );
        refetch();
        setOpen(false);
      }
      console.log('Update response:', res);
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      console.error('Error submitting form:', error);
    }
  };

  const handleUpdate = async (values) => {
    console.log('Form values:', values);
    const { institution, address, certificate_title, attachment } = values;

    const payload = {
      accreditationInfo: {
        _id: selectedAccreditation?._id,
        institution,
        address,
        certificate_title,
      },
    };

    console.log('payload', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    const isFile = attachment && attachment[0] instanceof File;

    if (isFile) {
      formData.append('attachment', attachment[0]);
    } else if (typeof attachment === 'string') {
      // Keep old file reference in a field (optional backend support needed)
      payload.accreditationInfo.attachment = attachment;
      formData.set('data', JSON.stringify(payload));
    }

    console.log('data', JSON.parse(formData?.get('data')));

    try {
      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Accreditation updated successfully');
        refetch();
        setIsEditModalOpen(false);
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
      <div>
        <div className="flex items-center justify-between gap-5">
          <div>
            <h3 className="heading-lg font-semibold text-black">
              Accreditations or Legal Practising Certificates
            </h3>
            <p className="text-sm text-[#8E8E8E] mt-2">
              Demonstrate your qualifications and professionalism by showcasing
              your accreditations. Verified memberships, certifications, and
              licenses from recognized legal institutions help build trust and
              credibility, giving clients the confidence to choose your
              services.
            </p>
          </div>
          <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
            <CircleAlert className="w-4 h-4" />
            <span>Optional</span>
            {/* <ToggleSwitch onToggle={handleToggle} /> */}
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <AccreditationsList
            profile={profile}
            handleEditClick={handleEditClick}
            refetch={refetch}
          />
          <AddAccreditationModal
            defaultValues={defaultValues}
            handleSubmit={handleSubmit}
            setOpen={setOpen}
            open={open}
          />
        </div>
      </div>
      <EditAccreditationFormModal
        defaultValues={{
          institution: selectedAccreditation?.institution || '',
          address: selectedAccreditation?.address || '',
          certificate_title: selectedAccreditation?.certificate_title || '',
          attachment: selectedAccreditation?.attachment || null, // this will be used for preview
        }}
        handleSubmit={handleUpdate}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
