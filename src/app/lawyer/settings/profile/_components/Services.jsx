'use client';

import ServicesList from './services/ServicesList';
import ServiceAddModal from './services/ServiceAddModal';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import { useState } from 'react';
import EditServiceModal from './services/EditServiceModal';
import { Loader } from 'lucide-react';

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
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center gap-5">
        <div>
          <h3 className="text-black font-semibold heading-lg">Your Services</h3>

          <p className="mt-[10px] text-[#8E8E8E]">
            List the legal services you offer so we can connect you with the
            most relevant clients seeking your expertise.
          </p>
        </div>
        {/*  Services modal */}
        <ServiceAddModal
          profile={profile}
          updateUserData={updateUserData}
          refetch={refetch}
        />
      </div>
      <ServicesList
        profile={profile}
        handleEditClick={handleEditClick}
        refetch={refetch}
      />
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
