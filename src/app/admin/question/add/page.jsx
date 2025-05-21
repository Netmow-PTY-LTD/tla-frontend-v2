'use client';
import React, { useEffect, useRef, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import {
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useGetServiceWiseQuestionsQuery,
  useLazyGetServiceWiseQuestionsQuery,
  useUpdateQuestionOrderMutation,
} from '@/store/features/admin/questionApiService';
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { slugify } from '@/helpers/generateSlug';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { QuestionDialog } from '../../_components/modal/QuestionModal';
import { SimpleQuestionTable } from '@/components/common/SimpleQuestionTable';

export default function AddQuestionPage() {
  //state variables
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);

  const router = useRouter();

  //fetched api data
  const { data: countryList } = useGetCountryListQuery();
  //console.log('countryList', countryList);
  const { data: countrywiseServices, isFetching } =
    useGetCountryWiseServicesQuery(selectedCountry, {
      skip: !selectedCountry, // Skip query if no country is selected
    });

  //edit modal

  const handleModalOpen = (id) => {
    setDialogOpen(true);

    const singleQuestion = singleServicewiseQuestionsData?.data?.find(
      (item) => item?._id === id
    );

    setSelectedItem(singleQuestion);
  };

  //Table columns
  const columns = [
    {
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('question')}</div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('slug')}</div>
      ),
    },
    {
      accessorKey: 'questionType',
      header: 'Question Type',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('questionType')}</div>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Order',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('order')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleModalOpen(item?._id)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteQuestion(item?._id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  //form validation
  const formSchema = z.object({
    countryId: z.string().min(2, {
      message: 'Country name is required.',
    }),
    serviceId: z.string().min(1, {
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
      countryId: '',
      serviceId: '',
      question: '',
      slug: '',
      questionType: '',
    },
  });

  //dynamic slug
  const name = form.watch('question');

  useEffect(() => {
    const slug = slugify(name); // Replace spaces with dashes
    form.setValue('slug', slug);
  }, [name, form]);

  //country change handler

  const handleCountryChange = (val) => {
    setSelectedCountry(val);
    setSelectedService(''); // reset service
  };

  //Countrywise service handler

  const handleCountryWiseServiceChange = (val) => {
    console.log('Service', val);
    setSelectedService(val);
  };

  // console.log('selectedCountry', selectedCountry);

  // console.log('selectedService', selectedService);

  //single service wise questions

  const [
    singleServicewiseQuestions,
    { data: singleServicewiseQuestionsData, isFetching: isQuestionsLoading },
  ] = useLazyGetServiceWiseQuestionsQuery();

  useEffect(() => {
    if (selectedCountry && selectedService) {
      singleServicewiseQuestions({
        countryId: selectedCountry,
        serviceId: selectedService,
      });
    }
  }, [selectedCountry, selectedService]);

  useEffect(() => {
    if (singleServicewiseQuestionsData) {
      setData(singleServicewiseQuestionsData?.data);
    }
  }, [singleServicewiseQuestions]);

  console.log('data', data);

  //handling adding service wise question
  const [addQuestion, { isLoading }] = useAddQuestionMutation();

  async function onSubmit(values) {
    console.log('values', values);
    try {
      const result = await addQuestion(values).unwrap();
      // Optionally reset form or show success toast
      if (result) {
        showSuccessToast(result?.message);
        setTimeout(() => {
          router.push(`/admin/question/add`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding question:', error);
      // Optionally show error toast
      showErrorToast(
        error?.data?.errorSources?.[0]?.message ||
          error?.data?.message ||
          'Failed to add question.'
      );
    }
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-1/3 pr-5">
          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="countryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={handleCountryChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countryList?.data?.map((country, i) => {
                              return (
                                <SelectItem key={i} value={country?._id}>
                                  {country?.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <Select onValueChange={handleCountryWiseServiceChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countrywiseServices?.data?.map((service, i) => {
                              return (
                                <SelectItem key={i} value={service?._id}>
                                  {service?.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a question type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="radio">Radio</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                          </SelectContent>
                        </Select>
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
        <div className="w-2/3 pl-5">
          <SimpleQuestionTable
            data={singleServicewiseQuestionsData?.data || []}
            setData={setData}
            columns={columns}
            searchColumn="question"
          />
        </div>
      </div>
      <QuestionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
      />
    </>
  );
}
