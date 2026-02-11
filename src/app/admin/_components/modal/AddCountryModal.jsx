'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useAddCountryMutation } from '@/store/features/public/publicApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';

export default function AddCountryModal({ open, onClose }) {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Country name must be at least 2 characters.',
    }),
    slug: z.string().min(2).max(3, {
      message: 'Country code must be 2 to 3 characters.',
    }),
    currency: z.string().min(1).max(10, {
      message: 'Currency must be 1 to 10 characters.',
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      currency: '',
    },
  });

  const [addCountry, { isLoading }] = useAddCountryMutation();

  async function onSubmit(values) {
    const capitalize = (str) =>
      str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const payload = {
      name: capitalize(values.name),
      slug: values.slug.toLowerCase(),
      currency: values.currency.toUpperCase(),
    };

    try {
      const result = await addCountry(payload).unwrap();
      showSuccessToast(result?.message);
      onClose();
      form.reset();
    } catch (error) {
      const fallbackMessage = 'An unexpected error occurred.';
      const message =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        fallbackMessage;

      showErrorToast(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Country</DialogTitle>
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
                    <Input placeholder="Country Name" {...field} />
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
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Country Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input placeholder="Currency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
