'use client';
import React from 'react';
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
import { useAddCountryMutation } from '@/store/features/public/publicApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
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

  // 1. Define your form.
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
      name: capitalize(values.name), // Capitalized name
      slug: values.slug.toLowerCase(), // Lowercase code
      currency: values.currency.toUpperCase(), // Uppercase currency
    };

    try {
      const result = await addCountry(payload).unwrap();
      showSuccessToast(result?.message);
      setTimeout(() => {
        router.push('/admin/country/list');
      }, 2000);
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
    <div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Add Country</CardTitle>
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
              <Button type="submit">Add</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
