'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useAddRangeMutation,
  useAddZipCodeMutation,
  useGetCountryListQuery,
} from '@/store/features/public/publicApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import z from 'zod';

export default function CreateRangeModal({ isOpen, onClose }) {
  const defaultValues = {
    name: '',
    value: null,
  };

  const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Range name must be at least 1 character.',
    }),
    value: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: 'Value must be a positive number.',
      })
    ),
  });

  const [addRange, { isLoading }] = useAddRangeMutation();

  async function onSubmit(values) {
    const payload = {
      name: values.name,
      value: Number(values.value),
    };

    try {
      const result = await addRange(payload).unwrap();
      if (result) {
        showSuccessToast(result?.message || 'Range added successfully');
        onClose();
      }
    } catch (error) {
      const message = error?.data?.message || 'An unexpected error occurred.';
      showErrorToast(message);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Range</DialogTitle>
        </DialogHeader>
        <FormWrapper
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          schema={formSchema}
        >
          <TextInput name="name" label="Range" placeholder="range name" />
          <TextInput
            name="value"
            type="text"
            label="Value"
            placeholder="range value"
          />
          <Button type="submit">Add</Button>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
