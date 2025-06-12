'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import z from 'zod';
import { useForm } from 'react-hook-form';
import {
  useEditRangeMutation,
  useGetSingleRangeQuery,
} from '@/store/features/public/publicApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';

export default function EditRangeModal({ open, onClose, rangeId }) {
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const [defaultValues, setDefaultValues] = useState({
    name: '',
    value: 0,
  });

  const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Range name must be at least 1 character.',
    }),
    value: z.number().min(1, {
      message: 'Value must be a positive number and at least 1 character.',
    }),
  });

  const {
    data: singleRange,
    isSuccess,
    isLoading,
    refetch,
  } = useGetSingleRangeQuery(rangeId, {
    skip: !rangeId,
  });

  // Trigger loader on open
  useEffect(() => {
    if (open && rangeId) {
      setIsLocalLoading(true);
      refetch();
    }
  }, [open, rangeId, refetch]);

  useEffect(() => {
    if (isSuccess && singleRange?.data) {
      setDefaultValues({
        name: singleRange?.data?.name ?? '',
        value: singleRange?.data?.value ?? '',
      });
      setIsLocalLoading(false);
    }
  }, [isSuccess, singleRange]);

  const [editRange] = useEditRangeMutation();
  const onSubmit = async (values) => {
    const payload = {
      _id: rangeId,
      name: values.name,
      value: Number(values.value),
    };

    try {
      const res = await editRange(payload).unwrap();
      if (res) {
        showSuccessToast(res?.message || 'Range updated successfully!');
        onClose(); // Close modal after update
        refetch();
      }
    } catch (error) {
      const message = error?.data?.message || 'Failed to update range.';
      showErrorToast(message);
    }
  };

  console.log('isLocalLoading', isLocalLoading);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Range</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading range details...</p>
            {/* You can replace this with a spinner */}
          </div>
        ) : (
          <FormWrapper
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            schema={formSchema}
          >
            <TextInput name="name" label="Range" placeholder="range name" />
            <TextInput
              name="value"
              type="number"
              label="Value"
              placeholder="range value"
            />
            <Button type="submit">Update</Button>
          </FormWrapper>
        )}
      </DialogContent>
    </Dialog>
  );
}
