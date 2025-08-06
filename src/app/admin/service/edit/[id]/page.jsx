'use client';
import { useEditServiceMutation, useSingleServiceQuery } from '@/store/features/admin/servicesApiService';
import { useParams, useRouter } from 'next/navigation';
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
} from '@/components/ui/form';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';

export default function EditService() {
  const params = useParams();
  const router = useRouter();
  const formSchema = z.object({
      name: z.string().min(2, {
        message: 'Service name must be at least 2 characters.',
      }),
      slug: z.string().min(1, {
        message: 'Slug is required.',
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
      data: singleService,
      isLoading,
      isSuccess,
    } = useSingleServiceQuery(params.id);
  
    useEffect(() => {
      if (isSuccess && singleService) {
        form.reset({
          name: singleService?.data?.name || '',
          slug: singleService?.data?.slug || '',
        });
      }
    }, [isSuccess, singleService, form]);
    const [editService] = useEditServiceMutation();
  
    async function onSubmit(values) {
  
      try {
        const res = await editService({ id: params.id, ...values }).unwrap();
        showSuccessToast(res?.message || 'Service updated successfully!');
        setTimeout(() => {
          router.push('/admin/service/list');
        }, 2000);
      } catch (error) {
        showErrorToast('Failed to update country.');
        console.error(error);
      }
    }
  return <div>
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
                  </FormItem>
                )}
              />
              <Button type="submit">Add</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
}
