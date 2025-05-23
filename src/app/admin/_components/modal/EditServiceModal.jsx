'use client';
import React, { useEffect, useState } from 'react';
import {
  useEditServiceMutation,
  useSingleServiceQuery,
} from '@/store/features/admin/servicesApiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';

export default function EditServiceModal({ id, open, onClose }) {
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Service name must be at least 2 characters.',
    }),
    slug: z.string().min(1, {
      message: 'Slug is required.',
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const {
    data: singleService,
    isSuccess,
    refetch,
  } = useSingleServiceQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (open && id) {
      setIsLocalLoading(true);
      refetch(); // Always fetch fresh data
    }
  }, [open, id, refetch]);

  useEffect(() => {
    if (isSuccess && singleService?.data) {
      form.reset({
        name: singleService.data.name || '',
        slug: singleService.data.slug || '',
      });
      setIsLocalLoading(false);
    }
  }, [isSuccess, singleService, form]);

  const [editService, { isLoading }] = useEditServiceMutation();

  async function onSubmit(values) {
    try {
      const res = await editService({ id, ...values }).unwrap();
      showSuccessToast(res?.message || 'Service updated successfully!');
      onClose();
    } catch (error) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to update service.';
      showErrorToast(errorMessage);
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        {isLocalLoading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading service details...</p>
            {/* Replace with a <Loader /> if you have a spinner */}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Service Name"
                        {...field}
                        onChange={(e) => {
                          const nameValue = e.target.value;
                          const slugValue = nameValue
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/--+/g, '-');

                          field.onChange(nameValue);
                          form.setValue('slug', slugValue);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Slug" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
