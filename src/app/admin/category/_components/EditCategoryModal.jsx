'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,

  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { useEditcategoryMutation, useSinglecategoryQuery } from '@/store/features/admin/categoryApiService';
import FormWrapper from '@/components/form/FromWrapper';
import FormField from './FormField';
import { Loader } from 'lucide-react';

export default function EditCategoryModal({ id, open, onClose }) {
  const [defaultValues, setDefaultValues] = useState({ name: '', slug: '', image: null });

  const {
    data: singleCategory,
    isSuccess,
    isLoading: isLoaingSingleCategory,
    refetch,
  } = useSinglecategoryQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (open && id) {
      refetch(); // Always fetch fresh data
    }
  }, [open, id, refetch]);

  useEffect(() => {
    if (isSuccess && singleCategory?.data) {
      setDefaultValues({
        name: singleCategory.data.name || '',
        slug: singleCategory.data.slug || '',
        image: singleCategory.data.image || null,
      });
    }
  }, [isSuccess, singleCategory]);

  const [editCategory, { isLoading }] = useEditcategoryMutation();

  async function onSubmit(values) {

    try {

      const formData = new FormData();
      const payload = {
        name: values.name,
        slug: values.slug
      }

      formData.append('data', JSON.stringify(payload));
      if (values.image instanceof File) {
        formData.append('file', values.image);
      }
      const res = await editCategory({ id, data: formData }).unwrap();
      showSuccessToast(res?.message || 'Category updated successfully!');
      onClose();
    } catch (error) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to update category.';
      showErrorToast(errorMessage);
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        {isLoaingSingleCategory ? (
          <div className="flex justify-center items-center py-10">
            <p> <Loader /> Loading category details...</p>

          </div>
        ) : (
          <FormWrapper onSubmit={onSubmit} defaultValues={defaultValues}  >
            <FormField onClose={onClose} isLoading={isLoading} />
          </FormWrapper>
        )}
      </DialogContent>
    </Dialog>
  );
}
