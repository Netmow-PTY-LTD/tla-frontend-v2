'use client';

import React, { useState } from 'react';
import TextInput from '@/components/form/TextInput';
import TextArea from '@/components/form/TextArea';
import { Modal } from '@/components/UIComponents/Modal';
import FormWrapper from '@/components/form/FromWrapper';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { z } from 'zod';

 const customServiceSchema = z.object({
  title: z
    .string({ invalid_type_error: 'Title must be a string' })
    .min(1, { message: 'Title is required' }),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .min(1, { message: 'Description is required' }),
});



const EditServiceModal = ({
  updateUserData,
  refetch,
  selectedService,
  open,
  onClose,
}) => {
  const onCancel = () => onClose(); // correctly close modal

  const defaultValues = {
    title: selectedService?.title ?? '',
    description: selectedService?.description ?? '',
  };

  const handleSubmit = async (values) => {
    const { title, description } = values;

    const payload = {
      serviceInfo: {
        _id: selectedService?._id,
        title,
        description,
      },
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    try {
      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Service updated successfully');
        refetch();
        onClose();
      }
      // console.log('Update response:', res);
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <Modal
        description="Describe what you can offer to customers"
        title="Update service"
        onOpenChange={onClose}
        open={open}
      >
        <FormWrapper onSubmit={handleSubmit} defaultValues={defaultValues} schema={customServiceSchema}>
          <div className="space-y-5">
            <TextInput
              label="Service Title"
              name="title"
              placeholder={'Service Type'}
              textColor="text-[#6e6e6e]"
            />
            <TextArea
              label="Service Description"
              name="description"
              textColor="text-[#6e6e6e]"
            />
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-between items-center pt-4 ">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]">
              Update
            </button>
          </div>
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default EditServiceModal;
