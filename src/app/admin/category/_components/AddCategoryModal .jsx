'use client';
import React  from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import z from 'zod';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useAddCategoryMutation } from '@/store/features/admin/categoryApiService';
import FormWrapper from '@/components/form/FromWrapper';

import FormField from './FormField';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Category name must be at least 2 characters.',
  }),
  slug: z.string().min(1, {
    message: 'Slug is required.',
  }),
  image: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, {
      message: 'Image is required.',
    }).optional(),
});

export default function AddCategoryModal({ open, onClose }) {
  const [addCategory, { isLoading }] = useAddCategoryMutation();

 

  const onSubmit = async (values) => {
    if (!values?.image || values.image.size === 0) {
      showErrorToast('Image is required');
      return;
    }

    try {
      const formData = new FormData();
      const payload = {
        name: values.name,
        slug: values.slug
      }

      formData.append('file', values.image);
      formData.append('data', JSON.stringify(payload));
      const result = await addCategory(formData).unwrap();
      showSuccessToast(result?.message || 'Category added successfully');
      onClose();
    } catch (error) {
      const backendMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to add category.';
      showErrorToast(backendMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <FormWrapper onSubmit={onSubmit} schema={formSchema}>
         <FormField onClose={onClose} isLoading={isLoading}/>
        </FormWrapper>

      </DialogContent>
    </Dialog>
  );
}
