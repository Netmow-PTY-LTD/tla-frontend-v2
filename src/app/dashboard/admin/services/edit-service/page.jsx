'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Controller, useForm } from 'react-hook-form';
import { CircleX } from 'lucide-react';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';
import {
  useAllServicesQuery,
  useEditServicesMutation,
  useSingleServicesQuery,
} from '@/store/baseApi/super-admin/servicesApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter, useSearchParams } from 'next/navigation';
import { convertImageUrlToFile } from '@/lib/helperFunctions/page';
import { Input } from '@/components/ui/input';

const EditServicePageInSuperAdmin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service_id');

  const [imagePreview, setImagePreview] = useState(null);
  const [editService, { isLoading: editServiceIsLoading }] =
    useEditServicesMutation();

  const {
    data: singleServicesData,
    error: singleServicesError,
    isLoading: singleServicesIsLoading,
    refetch: singleServicesRefetch,
  } = useSingleServicesQuery(serviceId, {
    skip: !serviceId,
    refetchOnMountOrArgChange: true,
  });

  const { data: allServicesData, refetch: allServicesRefetch } =
    useAllServicesQuery();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      serviceName: '',
      title: '',
      description: '',
      buttonText: '',
      image: null,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (singleServicesData?.data) {
        reset(singleServicesData?.data);

        const imageUrl = singleServicesData?.data?.image?.url;
        if (imageUrl) {
          const file = await convertImageUrlToFile(imageUrl);

          setImagePreview(imageUrl);
          setValue('image', file);
        }
      }
    };

    loadData();
  }, [singleServicesData, reset, setValue]);

  const onSubmit = async (data) => {
    const forUpdateData = { ...data, service_id: serviceId };
    // console.log(forUpdateData);

    try {
      const finalData = new FormData();
      Object.entries(forUpdateData).forEach(([key, value]) => {
        finalData.append(key, value);
      });

      const res = await editService(finalData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Action successful');
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

  if (singleServicesIsLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoaderSpinner />
      </div>
    );
  }

  if (singleServicesError) {
    return (
      <div className="text-center text-red-600">
        Error: {singleServicesError.message}
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Service</CardTitle>
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
              </label>
              <Controller
                name="image"
                className="cursor-pointer"
                control={control}
                render={() => (
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                  />
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
                {isSubmitting ? <LoaderSpinner /> : <span>Update</span>}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditServicePageInSuperAdmin;
