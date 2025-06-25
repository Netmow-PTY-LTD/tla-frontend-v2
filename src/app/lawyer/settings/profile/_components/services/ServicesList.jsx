'use client';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useDeleteCustomServiceMutation } from '@/store/features/admin/userApiService';
import { Edit, Trash } from 'lucide-react';
import React from 'react';

export default function ServicesList({ profile, handleEditClick, refetch }) {
  return (
    <div className="mt-6 space-y-4">
      {profile?.customService?.length > 0 &&
        profile?.customService?.map((service, i) => (
          <ServiceCard
            service={service}
            key={i}
            handleEditClick={handleEditClick}
            refetch={refetch}
          />
        ))}
    </div>
  );
}

const ServiceCard = ({ service, handleEditClick, refetch }) => {
  const { title, description } = service;
  const [deleteCustomService] = useDeleteCustomServiceMutation();

  const handleDeleteClick = async (serviceId) => {
    try {
      const res = await deleteCustomService(serviceId).unwrap();
      if (res?.success) {
        showSuccessToast('Service deleted successfully');
        refetch();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      showErrorToast(error?.data?.message || 'Failed to delete service');
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <h2 className="heading-base font-semibold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEditClick(service)}
          >
            <Edit size={18} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteClick(service?._id)}
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};
