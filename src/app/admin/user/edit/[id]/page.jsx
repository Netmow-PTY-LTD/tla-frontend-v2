'use client';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  useSingleUserQuery,
  useEditProfileMutation,
} from '@/store/features/admin/userApiService';

export default function UserBasicInfo() {
  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    userId: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.string(),
    regUserType: z.string(),
    accountStatus: z.string(),
    name: z.string(),
    profileType: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
      username: '',
      email: '',
      role: '',
      regUserType: '',
      accountStatus: '',
      name: '',
      profileType: '',
    },
  });

  const { data: userData, isSuccess } = useSingleUserQuery(params.id);
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const showSuccessToast = (msg) => alert(msg);
  const showErrorToast = (msg) => alert(msg);

  useEffect(() => {
    if (isSuccess && userData?.data) {
      const user = userData.data;

      console.log('user', user?._id);
      form.reset({
        userId: user._id || '',
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
        regUserType: user.regUserType || '',
        accountStatus: user.accountStatus || '',
        name: user.profile?.name || '',
        profileType: user.profile?.profileType || '',
      });
    }
  }, [isSuccess, userData, form]);

  // const onSubmit = async (values) => {
  //   try {
  //     const payload = {
  //       service_id: params.id,
  //       accountStatus: values.accountStatus,
  //     };
  //     const res = await editProfile(payload).unwrap();
  //     showSuccessToast(res?.message || 'User status updated!');
  //   } catch (err) {
  //     showErrorToast(
  //       'Failed to update status: ' + (err?.data?.message || err.message)
  //     );
  //   }
  // };

  const onSubmit = async (values) => {
    try {
      console.log('values', values);

      const formData = new FormData();

      // Append all form values
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // ✅ Log actual contents of FormData
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const res = await editProfile(formData).unwrap();
      showSuccessToast(res?.message || 'User status updated!');
    } catch (err) {
      showErrorToast(
        'Failed to update status: ' + (err?.data?.message || err.message)
      );
    }
  };

  return (
    <div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>User Basic Info</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel className="hidden">User ID</FormLabel>
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
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
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regUserType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profileType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active Profile</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
