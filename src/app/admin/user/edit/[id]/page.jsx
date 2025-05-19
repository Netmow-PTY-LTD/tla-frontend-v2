'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import {
  useGetSingleUserQuery,
  useEditUserMutation,
} from '@/store/features/admin/userApiService';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  // Add more fields if needed (e.g., phone, role, etc.)
});

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [editUser] = useEditUserMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const { data: singleUser, isSuccess } = useGetSingleUserQuery(params.id);

  useEffect(() => {
    if (isSuccess && singleUser?.data) {
      form.reset({
        name: singleUser.data.name || '',
        email: singleUser.data.email || '',
      });
    }
  }, [isSuccess, singleUser, form]);

  async function onSubmit(values) {
    try {
      const res = await editUser({
        id: params.id,
        ...values,
      }).unwrap();
      showSuccessToast(res?.message || 'User updated successfully!');
      setTimeout(() => {
        router.push('/admin/user/list');
      }, 2000);
    } catch (error) {
      const backendMessage =
        error?.data?.err?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to update user.';
      showErrorToast(backendMessage);
      console.error('Error updating user:', error);
    }
  }

  return (
    <div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
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
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
