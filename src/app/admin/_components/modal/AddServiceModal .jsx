'use client';
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddServiceMutation } from '@/store/features/admin/servicesApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Service name must be at least 2 characters.',
  }),
  slug: z.string().min(1, {
    message: 'Slug is required.',
  }),
});

export default function AddServiceModal({ open, onClose }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const [addService, { isLoading }] = useAddServiceMutation();

  const name = form.watch('name');

  useEffect(() => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    form.setValue('slug', slug);
  }, [name, form]);

  const onSubmit = async (values) => {
    try {
      const result = await addService(values).unwrap();
      showSuccessToast(result?.message || 'Service added successfully');
      onClose(); // Close the modal
      form.reset(); // Optional: Reset the form after submission
    } catch (error) {
      const backendMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to add service.';
      showErrorToast(backendMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Service Name" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
