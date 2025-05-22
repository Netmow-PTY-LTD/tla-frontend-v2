'use client';
import React, { useEffect, useState } from 'react';
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
import { useGetCountryWiseServicesQuery } from '@/store/features/admin/servicesApiService';
import { useGetCountryListQuery } from '@/store/features/public/publicApiService';
import { slugify } from '@/helpers/generateSlug';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, ChevronsUpDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { AddOptionDialog } from '../../_components/modal/AddOptionModal';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import { SelectOptionsModal } from '../../_components/modal/SelectOptionsModal';
import { EditOptionDialog } from '../../_components/modal/EditOptionModal';
import { useDeleteOptionMutation } from '@/store/features/admin/optionApiService';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { AdminCollapsible } from '../../_components/AdminCollapsible';

export default function AddOptionPage() {
  //state variables
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectOptionsModalOpen, setSelectOptionsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [editOptionModalOpen, setEditOptionModalOpen] = useState(false);
  const [question, setQuestion] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [option, setOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const router = useRouter();

  //fetched api data
  const { data: countryList } = useGetCountryListQuery();
  //console.log('countryList', countryList);
  const { data: countrywiseServices, isFetching } =
    useGetCountryWiseServicesQuery(selectedCountry, {
      skip: !selectedCountry, // Skip query if no country is selected
    });

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
    console.log('value', val);
    setSelectedCountry(val);
  };

  //country wise service change handler

  const handleCountryWiseServiceChange = (val) => {
    console.log('value', val);
    setSelectedService(val);
  };

  // console.log('selected country', selectedCountry);
  // console.log('selected service', selectedService);

  //single service wise questions

  const {
    data: singleServicewiseQuestionsData,
    isFetching: isQuestionsLoading,
    refetch: singleServicewiseQuestionsRefetch,
  } = useGetServiceWiseQuestionsQuery(
    {
      countryId: selectedCountry,
      serviceId: selectedService,
    },
    {
      skip: !selectedCountry || !selectedService,
    }
  );

  // useEffect(() => {
  //   if (selectedCountry && selectedService) {
  //     singleServicewiseQuestions({
  //       countryId: selectedCountry,
  //       serviceId: selectedService,
  //     });
  //   }
  // }, [selectedCountry, selectedService]);

  console.log('singleServicewiseQuestionsData', singleServicewiseQuestionsData);

  //Add option modal handling

  const handleModalOpen = (id) => {
    setDialogOpen(true);
    const singleQuestion = singleServicewiseQuestionsData?.data?.find(
      (item) => item?._id === id
    );
    setSelectedItem(singleQuestion);
  };

  //handling adding service wise question

  async function onSubmit(values) {
    console.log('values', values);
    // try {
    //   const result = await addQuestion(values).unwrap();
    //   // Optionally reset form or show success toast
    //   if (result) {
    //     showSuccessToast(result?.message);
    //     setTimeout(() => {
    //       router.push(`/admin/question/add`);
    //     }, 2000);
    //   }
    // } catch (error) {
    //   console.error('Error adding question:', error);
    //   // Optionally show error toast
    //   showErrorToast(
    //     error?.data?.errorSources?.[0]?.message ||
    //       error?.data?.message ||
    //       'Failed to add question.'
    //   );
    // }
  }

  //   const { data: questionWiseOptions, isLoading: isOptionsLoading } =
  //     useGetQuestionWiseOptionsQuery(selectedQuestionId, {
  //       skip: !selectedQuestionId,
  //     });

  //console.log('questionWiseOptions', questionWiseOptions?.data);

  //handle SelectOptionsModal
  const handleSelectOptionsModal = (option, currentOrder) => {
    setOption(option);
    const allQuestions = singleServicewiseQuestionsData?.data || [];
    const nextQuestion = allQuestions.find((q) => q.order === currentOrder + 1);
    if (nextQuestion) {
      setSelectedQuestion(nextQuestion); // ⬅️ set next question, not current
      setSelectOptionsModalOpen(true);
    } else {
      showErrorToast('No next question found.');
    }
  };

  //handle SelectOptionsModal
  const handleEditOptionModal = (questionId, OptionId) => {
    // console.log('questionId', questionId);
    // console.log('questionId', OptionId);
    const singleQuestion = singleServicewiseQuestionsData?.data?.find(
      (item) => item?._id === questionId
    );

    setQuestion(singleQuestion);

    const singleOption = singleQuestion?.options?.find(
      (option) => option?._id === OptionId
    );
    setSelectedOption(singleOption);
    setEditOptionModalOpen(true);
  };

  //handling delete option

  const [deleteOption] = useDeleteOptionMutation();

  const handleDeleteOption = async (id) => {
    //console.log('option id', id);
    try {
      const res = await deleteOption(id).unwrap();
      if (res) {
        showSuccessToast(res?.message);
        await singleServicewiseQuestionsRefetch();
      }
    } catch (err) {
      console.log('Error in deleting option', err);
      showErrorToast(err?.data?.message || 'Failed to delete option.');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add Options</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              </div>

              {/* <Button type="submit">Add</Button> */}
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-10">
        <Accordion type="single" collapsible className="w-full">
          {singleServicewiseQuestionsData?.data?.map((item, i, arr) => (
            <AccordionItem value={item?._id} key={i}>
              <AccordionTrigger>
                {item?.question}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalOpen(item?._id);
                  }}
                  className="p-2 bg-black text-white rounded-md cursor-pointer ml-auto mr-4"
                >
                  Add Option
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <table className="w-full border border-muted rounded-md text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Option Name
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Actions
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Selected Options
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(item?.options ?? []).map((option, j) => (
                      <tr
                        key={j}
                        className="border-t border-muted transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-2 font-medium text-foreground">
                          {option?.name}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {i !== arr?.length - 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSelectOptionsModal(option, item?.order)
                                }
                              >
                                Select Next Options
                              </Button>
                            )}
                            <div
                              className="flex items-center gap-2 cursor-pointer border border-b border-1 py-1 px-2 rounded-md"
                              onClick={() =>
                                handleEditOptionModal(item?._id, option?._id)
                              }
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </div>
                            <div
                              className="flex items-center gap-2 cursor-pointer border border-b border-1 py-1 px-2 rounded-md"
                              onClick={() => handleDeleteOption(option?._id)}
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </div>
                          </div>
                        </td>
                        <td>
                          <AdminCollapsible
                            item={option?.selected_options ?? []}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <AddOptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        refetch={singleServicewiseQuestionsRefetch}
      />

      <EditOptionDialog
        open={editOptionModalOpen}
        onOpenChange={setEditOptionModalOpen}
        item={selectedOption}
        question={question}
        refetch={singleServicewiseQuestionsRefetch}
      />
      <SelectOptionsModal
        open={selectOptionsModalOpen}
        onOpenChange={setSelectOptionsModalOpen}
        item={selectedQuestion}
        option={option}
        refetch={singleServicewiseQuestionsRefetch}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </>
  );
}
