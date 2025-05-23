'use client';
import React, { useEffect } from 'react';
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
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { useParams } from 'next/navigation';
import {
  useEditCountryMutation,
  useGetSingleCountryQuery,
} from '@/store/features/public/publicApiService';

export default function Page() {
  const params = useParams();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Country name must be at least 2 characters.',
    }),
    slug: z.string().min(2).max(3, {
      message: 'Country code must be 2 to 3 characters.',
    }),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const {
    data: singleCountry,
    isLoading,
    isSuccess,
  } = useGetSingleCountryQuery(params.id);

  useEffect(() => {
    if (isSuccess && singleCountry) {
      form.reset({
        name: singleCountry?.data?.name || '',
        slug: singleCountry?.data?.slug || '',
      });
    }
  }, [isSuccess, singleCountry, form]);
  const [editCountry] = useEditCountryMutation();

  async function onSubmit(values) {
    // Format values
    const formattedValues = {
      name: values.name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      slug: values.slug.toLowerCase(),
    };

    console.log('Formatted Values:', formattedValues);

    try {
      const res = await editCountry({
        id: params.id,
        ...formattedValues,
      }).unwrap();
      showSuccessToast(res?.message || 'Country updated successfully!');
      setTimeout(() => {
        router.push('/admin/country/list');
      }, 2000);
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
    <div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Edit Country</CardTitle>
          {/* <CardDescription>
            Deploy your new project in one-click.
          </CardDescription> */}
        </CardHeader>
        <CardContent>
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
              <Button type="submit">Update</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
