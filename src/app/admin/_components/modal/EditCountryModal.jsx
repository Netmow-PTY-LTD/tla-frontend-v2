'use client';
import React, { useEffect, useState } from 'react';
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
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import {
  useEditCountryMutation,
  useGetSingleCountryQuery,
} from '@/store/features/public/publicApiService';
import { Loader2 } from 'lucide-react'; // Spinner icon


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
  taxPercentage: z.preprocess((val) => Number(val), z.number().min(0)),
  taxAmount: z.preprocess((val) => Number(val), z.number().min(0)),
  taxType: z.string().optional(),
}).refine(
  (data) => {
    if (data.taxPercentage > 0 && data.taxAmount > 0) {
      return false;
    }
    return true;
  },
  {
    message: 'Either taxPercentage OR taxAmount',
    path: ['taxAmount'],
  }
);

export default function EditCountryModal({ id, open, onClose }) {
  const [localLoading, setLocalLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      currency: '',
      taxPercentage: 0,
      taxAmount: 0,
      taxType: '',
    },
  });

  const {
    data: singleCountry,
    isSuccess,
    refetch,
  } = useGetSingleCountryQuery(id, {
    skip: !id || !open,
  });


  const [editCountry, { isLoading: isSubmitting }] = useEditCountryMutation();


  useEffect(() => {
    if (open && id) {
      setLocalLoading(true);
      refetch();
    }
  }, [open, id, refetch]);

  useEffect(() => {
    if (isSuccess && singleCountry) {
      form.reset({
        name: singleCountry?.data?.name || '',
        slug: singleCountry?.data?.slug || '',
        currency: singleCountry?.data?.currency || '',
        taxPercentage: singleCountry?.data?.taxPercentage || 0,
        taxAmount: singleCountry?.data?.taxAmount || 0,
        taxType: singleCountry?.data?.taxType || '',
      });
      setLocalLoading(false);
    }
  }, [isSuccess, singleCountry, form]);



  async function onSubmit(values) {
    const formattedValues = {
      ...values,
      name: values.name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      slug: values.slug.toLowerCase(),
      currency: values.currency.toUpperCase(),
    };

    try {
      const res = await editCountry({ id, ...formattedValues }).unwrap();
      showSuccessToast(res?.message || 'Country updated successfully!');
      onClose();
    } catch (error) {
      const backendMessage =
        error?.data?.err?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to update country.';
      showErrorToast(backendMessage);
      console.error('Error updating country:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Country</DialogTitle>
        </DialogHeader>

        {localLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading country details...
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="taxType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. VAT, GST" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
