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
import AddExperienceModal from './experiences/AddExperienceModal';
import ExperiencesList from './experiences/ExperiencesList';
import EditExperienceModal from './experiences/EditExperienceModal';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

export default function Experiences() {
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
          <h3 className="text-black font-semibold heading-lg">Experiences</h3>

          <p className="mt-[10px]">
            Include all services you offer in some detail to give customers the
            confidence they’re looking for when making a hiring decision.
          </p>
        </div>
        {/*  Services modal */}
        <AddExperienceModal
          profile={profile}
          updateUserData={updateUserData}
          refetch={refetch}
        />
      </div>
      <ExperiencesList profile={profile} handleEditClick={handleEditClick} />
      <EditExperienceModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedService={selectedService}
        updateUserData={updateUserData}
        refetch={refetch}
      />
      <SimpleEditor className="text-[#8E8E8E]" />
    </div>
  );
}
