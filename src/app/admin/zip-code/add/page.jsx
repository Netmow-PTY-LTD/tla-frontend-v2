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
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Page() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const router = useRouter();

  const formSchema = z.object({
    countryId: z.string().min(2, {
      message: 'Country name must be at least 2 characters.',
    }),
    zipcode: z.string().min(2, {
      message: 'Zip code must be 2 to 3 characters.',
    }),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryId: '',
      zipcode: '',
    },
  });

  //Post api data
  const [addZipCode, { isLoading }] = useAddZipCodeMutation();
  //fetched api data
  const { data: countryList } = useGetCountryListQuery();

  //country change handler
  const handleCountryChange = (val) => {
    console.log('value', val);
    setSelectedCountry(val);
  };

  async function onSubmit(values) {
    console.log('Original values', values);

    const payload = {
      countryId: values.countryId, // Capitalized name
      zipcode: values.zipcode, // Lowercase code
    };

    try {
      const result = await addZipCode(payload).unwrap();
      showSuccessToast(result?.message);
      setTimeout(() => {
        router.push('/admin/zip-code/list');
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
          <CardTitle>Add Zip Code</CardTitle>
          {/* <CardDescription>
            Deploy your new project in one-click.
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value); // update form state
                        handleCountryChange(value); // your custom handler
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryList?.data?.map((country, i) => (
                          <SelectItem key={i} value={country?._id}>
                            {country?.name}
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
              <Button type="submit">Add</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
