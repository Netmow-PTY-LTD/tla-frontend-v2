'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  useEditZipCodeMutation,
  useGetCountryListQuery,
  useGetSingleZipCodeQuery,
} from '@/store/features/public/publicApiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const formSchema = z.object({
  zipcode: z.string().min(4, { message: 'Zip Code must be at least 4 digits' }),
  countryId: z.string().min(1, { message: 'Country is required' }),
});

export default function EditZipCodePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const zipId = params?.id;
  const countryNameFromURL = searchParams.get('country');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipcode: '',
      countryId: '',
    },
  });

  const { data: singleZipCode, isSuccess } = useGetSingleZipCodeQuery(zipId);
  const { data: countryList } = useGetCountryListQuery();
  const [editZipCode] = useEditZipCodeMutation();

  useEffect(() => {
    if (isSuccess && singleZipCode?.data) {
      form.reset({
        zipcode: singleZipCode.data.zipcode,
        countryId: singleZipCode.data.countryId,
      });
    }
  }, [isSuccess, singleZipCode, form]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        _id: zipId, // ✅ Include id in the body
        zipcode: values.zipcode,
        countryId: values.countryId,
      };

      const res = await editZipCode(payload).unwrap();
      showSuccessToast(res?.message || 'Zip Code updated successfully!');

      setTimeout(() => {
        router.push('/admin/zip-code/list');
      }, 1500);
    } catch (error) {
      const message = error?.data?.message || 'Failed to update Zip Code.';
      showErrorToast(message);
      console.error('Update Error:', error);
    }
  };

  return (
    <div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Edit Zip Code</CardTitle>
          {countryNameFromURL && (
            <p className="text-sm text-muted-foreground">
              Editing for country: <strong>{countryNameFromURL}</strong>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
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
              <Button type="submit">Update</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
