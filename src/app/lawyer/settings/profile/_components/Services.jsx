'use client';

import ServicesList from './services/ServicesList';
import ServiceAddModal from './services/ServiceAddModal';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import { useState } from 'react';
import EditServiceModal from './services/EditServiceModal';

export default function Services() {
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

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const [updateUserData] = useUpdateUserDataMutation();
  const profile = userInfo?.data?.profile;
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center gap-5">
        <div>
          <h2 className="text-black font-semibold">Services</h2>

          <p className="mt-[10px]">
            Include all services you offer in some detail to give customers the
            confidence they’re looking for when making a hiring decision.
          </p>
        </div>
        {/*  Services modal */}
        <ServiceAddModal
          profile={profile}
          updateUserData={updateUserData}
          refetch={refetch}
        />
      </div>
      <ServicesList profile={profile} handleEditClick={handleEditClick} />
      <EditServiceModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedService={selectedService}
        updateUserData={updateUserData}
        refetch={refetch}
      />
    </div>
  );
}
