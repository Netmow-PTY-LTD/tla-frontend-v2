'use client';
import React, { use, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  useGetAllManagedServicesQuery,
  useGetCountryWiseServicesQuery,
  useManageServiceMutation,
} from '@/store/features/admin/servicesApiService';
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
import { MoreHorizontal, Pencil, Trash2, CloudUpload } from 'lucide-react';
import { useGetServiceWiseQuestionsQuery } from '@/store/features/admin/questionApiService';
import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import FileUploader from '@/components/UIComponents/fileUploader';

export default function ManageServices() {
  //state variables
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState(null);
  const [thumbImageFile, setThumbImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);

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
    setSelectedCountry(val);
  };

  //country wise service change handler

  const handleCountryWiseServiceChange = (val) => {
    console.log('Service value', val);
    setSelectedService(val);
  };

  console.log('selectedCountry', selectedCountry);
  console.log('selectedService', selectedService);

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

  const handleThumbImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbImageFile(file);
      setThumbPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      setBannerPreviewUrl(URL.createObjectURL(file));
    }
  };

  const [manageService] = useManageServiceMutation();

  async function onSubmit(values) {
    console.log('values', values);

    const { baseCredit, thumbImage, bannerImage } = values;

    const formData = new FormData();

    const payload = {
      countryId: selectedCountry,
      serviceId: selectedService,
      baseCredit,
    };

    formData.append('data', JSON.stringify(payload));

    // formData.append('countryId', selectedCountry);
    // formData.append('serviceId', selectedService);
    // formData.append('baseCredit', baseCredit || '');

    // Append images if FileList contains a File
    if (thumbImage?.[0] instanceof File) {
      formData.append('thumbImage', thumbImage[0]);
    }

    if (bannerImage?.[0] instanceof File) {
      formData.append('bannerImage', bannerImage[0]);
    }

    console.log('data', JSON.parse(formData?.get('data')));

    try {
      const res = await manageService(formData).unwrap();
      if (res) {
        showSuccessToast(res?.message);
        await singleServicewiseQuestionsRefetch();
      }
    } catch (err) {
      console.error('Error in submitting form', err);
      showErrorToast(err?.data?.message || 'Failed to submit form.');
    }
  }

  const { data: AllManagedServices } = useGetAllManagedServicesQuery(
    {
      countryId: selectedCountry,
      serviceId: selectedService,
    },
    {
      skip: !selectedCountry || !selectedService,
    }
  );

  const matchedService = useMemo(() => {
    if (!selectedService || !AllManagedServices?.data) return null;
    return (
      AllManagedServices.data.find(
        (item) => item?.serviceId === selectedService
      ) || null
    );
  }, [selectedService, AllManagedServices]);

  // 1. This is the final shape to pass to FormWrapper
  const serviceDefaultValues = useMemo(() => {
    return {
      baseCredit: matchedService?.baseCredit?.toString() || '',
    };
  }, [matchedService]);

  useEffect(() => {
    if (!selectedService || !AllManagedServices?.data) {
      setThumbPreviewUrl(null);
      setBannerPreviewUrl(null);
      return;
    }

    const matchedService = AllManagedServices.data.find(
      (item) => item?.serviceId === selectedService
    );

    setThumbPreviewUrl(matchedService?.thumbImage || null);
    setBannerPreviewUrl(matchedService?.bannerImage || null);
  }, [selectedService, AllManagedServices]);

  return (
    <>
      <div className="w-full md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {selectedService && (
        <div className="mt-5 flex flex-wrap">
          <div className="w-full md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <FormWrapper
                  onSubmit={onSubmit}
                  defaultValues={serviceDefaultValues}
                >
                  <TextInput
                    type="text"
                    name="baseCredit"
                    label="Base Credit"
                    placeholder="Base Credit"
                  />
                  <div>
                    <label
                      htmlFor="attachment"
                      className="text-[var(--color-black)] font-medium block mb-2"
                    >
                      Thumb Image
                    </label>
                    {thumbPreviewUrl && (
                      <div className="relative inline-block mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Preview:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={thumbPreviewUrl}
                            alt="Preview"
                            className="max-w-[80px] rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbPreviewUrl(null);
                              setThumbImageFile(null);
                            }}
                            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    <FileUploader
                      label="Upload File"
                      name="thumbImage"
                      onChange={handleThumbImageChange}
                      accept="image/*"
                      multiple={false}
                      icon={
                        <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
                      }
                      width="w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="attachment"
                      className="text-[var(--color-black)] font-medium block mb-2"
                    >
                      Banner Image
                    </label>
                    {bannerPreviewUrl && (
                      <div className="relative inline-block mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Preview:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={bannerPreviewUrl}
                            alt="Preview"
                            className="max-w-[80px] rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setBannerPreviewUrl(null);
                              setBannerImageFile(null);
                            }}
                            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    <FileUploader
                      label="Upload File"
                      name="bannerImage"
                      onChange={handleBannerImageChange}
                      accept="image/*"
                      multiple={false}
                      icon={
                        <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
                      }
                      width="w-full"
                    />
                  </div>
                  <div className="text-center mt-5">
                    <Button type="submit">{'Save'}</Button>
                  </div>
                </FormWrapper>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
