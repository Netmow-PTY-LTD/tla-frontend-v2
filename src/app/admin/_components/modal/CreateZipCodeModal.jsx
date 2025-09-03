'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  useAddZipCodeMutation,
  useGetCountryListQuery,
} from '@/store/features/public/publicApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const formSchema = z.object({
  countryId: z.string().nonempty('Country name is required').min(1, {
    message: 'Country name must be at least 1 character.',
  }),

  zipcode: z.string().nonempty('Zip code is required').min(1, {
    message: 'Zip code must be at least 1 character.',
  }),

  postalCode: z.string().nonempty('Postal code is required').min(2, {
    message: 'Postal code must be at least 1 character.',
  }),

  latitude: z.string().nonempty('Latitude is required').min(2, {
    message: 'Latitude must be at least 1 character.',
  }),

  longitude: z.string().nonempty('Longitude is required').min(2, {
    message: 'Longitude must be at least 1 character.',
  }),
});

export default function CreateZipCodeModal({ isOpen, onClose, onSuccess }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryId: '',
      zipcode: '',
      postalCode: '',
      latitude: '',
      longitude: '',
    },
  });

  const [addZipCode, { isLoading }] = useAddZipCodeMutation();
  const { data: countryList } = useGetCountryListQuery();

  async function onSubmit(values) {
    const payload = {
      countryId: values.countryId,
      zipcode: values.zipcode,
      postalCode: values.postalCode,
      latitude: values.latitude,
      longitude: values.longitude,
    };

    try {
      const result = await addZipCode(payload).unwrap();
      showSuccessToast(result?.message || 'Zip Code added successfully');
      onClose();
      form.reset();
      onSuccess?.(); // Call optional success callback
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Zip Code</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryList?.data?.map((country) => (
                        <SelectItem key={country._id} value={country._id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post code" {...field} />
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
