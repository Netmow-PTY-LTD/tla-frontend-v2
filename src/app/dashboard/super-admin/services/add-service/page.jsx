'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX } from 'lucide-react';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';
import {
  useAddServiceMutation,
  useAllServicesQuery,
} from '@/store/API/super-admin/servicesApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  serviceName: z.string().min(2, {
    message: 'Service name must be at least 2 characters.',
  }),
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  buttonText: z.string().min(3, {
    message: 'Button text must be at least 3 characters.',
  }),
  image: z.any().refine((file) => file !== null && file !== undefined, {
    message: 'Image is required.',
  }),
});

const AddServicePageInSuperAdmin = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [addService, { isLoading }] = useAddServiceMutation();
  const { data: allServicesData, refetch: allServicesRefetch } =
    useAllServicesQuery();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: '',
      title: '',
      description: '',
      buttonText: '',
      image: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        finalData.append(key, value);
      });

      const res = await addService(finalData).unwrap();

      if (res?.success === true) {
        showSuccessToast(res?.message || 'Action successful');
        reset({
          serviceName: '',
          title: '',
          description: '',
          buttonText: '',
          image: null,
        });
        allServicesRefetch();
        setImagePreview(null);
        router.push('/dashboard/super-admin/services/list-of-services');
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue('image', file);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Add Service</CardTitle>
          <span className="text-red-500  text-sm">
            All Fields Are Required *
          </span>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="serviceName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Name
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="serviceName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        id="serviceName"
                        placeholder="Enter Service name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      {errors.serviceName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.serviceName.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        id="title"
                        placeholder="Enter Service Title"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      {errors.title && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.title.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <>
                      <textarea
                        {...field}
                        id="description"
                        placeholder="Enter Service Description"
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      {errors.description && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.description.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="buttonText"
                  className="block text-sm font-medium text-gray-700"
                >
                  Button Text
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="buttonText"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        id="buttonText"
                        placeholder="Enter Button Text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      {errors.buttonText && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.buttonText.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="image"
                className="cursor-pointer"
                control={control}
                render={() => (
                  <>
                    <Input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                      onChange={(e) => handleImageChange(e.target.files[0])}
                    />
                    {errors.image && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.image.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {imagePreview && (
              <div className="mt-4 relative w-full max-w-xs">
                <div className="flex items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Image Preview
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setValue('image', null);
                    }}
                    className="absolute top-0 right-0 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <CircleX />
                  </button>
                </div>
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}

            <div className="flex justify-center mx-auto">
              <button
                type="submit"
                className="btn-brand"
                style={{ cursor: 'pointer' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoaderSpinner /> : <span>Submit</span>}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddServicePageInSuperAdmin;
