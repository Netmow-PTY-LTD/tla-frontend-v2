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
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { useAddQuestionMutation } from '@/store/features/admin/questionApiService';
import { useAllServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';

export default function AddService() {
  const router = useRouter();
  const { data: serviceList, refetch } = useAllServicesQuery();
  const { data: countryList } = useGetCountryListQuery();
  
  const formSchema = z.object({
    country: z.string().min(2, {
      message: 'Country name is required.',
    }),
    service: z.string().min(1, {
      message: 'Service name is required.',
    }),
    question: z.string().min(2, {
      message: 'Question is required.',
    }),
    slug: z.string().min(1, {
      message: 'Slug is required.',
    }),
    questionType: z.string().min(1, {
      message: 'Question type is required.',
    }),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: '',
      service: '',
      question: '',
      slug: '',
      questionType: ''
    },
  });

  const [addQuestion, {isLoading}] = useAddQuestionMutation();

  async function onSubmit(values) {
    console.log('values', values);
    try {
      const result = await addQuestion(values).unwrap();
      // Optionally reset form or show success toast
      if(result){
        showSuccessToast(result?.message);
        setTimeout(() => {
            router.push('/admin/question/list');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding country:', error);
      // Optionally show error toast
      showErrorToast(error?.data?.message);
    }
  }

  return (
    <div>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {countryList?.data?.map((country, i)=>{
                                return(
                                    <SelectItem key={i} value={country?._id}>{country?.name}</SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                             {serviceList?.data?.map((country, i)=>{
                                return(
                                    <SelectItem key={i} value={country?._id}>{country?.name}</SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Question" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Question Slug" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a question type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="m@example.com">radio</SelectItem>
                            <SelectItem value="m@google.com">checkbox</SelectItem>
                        </SelectContent>
                    </Select>
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
