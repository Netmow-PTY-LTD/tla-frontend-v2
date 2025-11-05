import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import MultipleTagsSelector from '@/components/MultipleTagsSelector';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import FileUploader from '@/components/UIComponents/fileUploader';
import { Modal } from '@/components/UIComponents/Modal';
import { slugify } from '@/helpers/generateSlug';
import {
  useAddMetaInfoMutation,
  useEditMetaInfoMutation,
  useGetSingleMetaInfoQuery,
} from '@/store/features/admin/SEOMetaApiService';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloudUpload, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const pagesSchema = z.object({
  pageKey: z
    .string({ required_error: 'Page key is required' })
    .min(2, { message: 'Page key must be between 2 and 100 characters' })
    .max(100, { message: 'Page key must be between 2 and 100 characters' }),
  slug: z.string().min(2, { message: 'Slug is required' }),
  metaTitle: z
    .string({ required_error: 'Meta title is required' })
    .refine((val) => val.trim().length > 0, {
      message: 'Meta title is required',
    })
    .refine((val) => val.length >= 2 && val.length <= 60, {
      message: 'Meta title must be between 2 and 60 characters',
    }),

  metaDescription: z
    .string({ required_error: 'Meta description is required' })
    .min(2, {
      message: 'Meta description must be between 2 and 160 characters',
    })
    .max(160, {
      message: 'Meta description must be between 2 and 160 characters',
    }),

  metaKeywords: z
    .array(
      z
        .string({ required_error: 'Keyword is required' })
        .min(2, {
          message: 'Each keyword must be between 2 and 100 characters',
        })
        .max(100, {
          message: 'Each keyword must be between 2 and 100 characters',
        })
    )
    .nonempty({ message: 'At least one keyword is required' }),

  metaImage: z
    .union([z.instanceof(File), z.string().url().nonempty()])
    .optional()
    .refine(
      (val) => !!val, // must exist (either URL or File)
      'Meta image is required'
    ),
});

export default function EditSEOMetaPageModal({
  open,
  setOpen,
  refetchMetaInfo,
  pageId,
}) {
  const [thumbPreviewUrl, setThumbPreviewUrl] = React.useState(null);
  const [thumbImageFile, setThumbImageFile] = React.useState(null);

  const { data: singlePageMetaInfo } = useGetSingleMetaInfoQuery(pageId, {
    skip: !pageId,
  });
  console.log('singlePageMetaInfo', singlePageMetaInfo);

  const singleMetaPageData = singlePageMetaInfo?.data;

  const defaultValues = React.useMemo(
    () => ({
      pageKey: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      metaImage: null,
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(pagesSchema),
  });

  const { watch, handleSubmit, setValue, reset } = methods;

  useEffect(() => {
    if (singleMetaPageData) {
      reset({
        pageKey: singleMetaPageData.pageKey || '',
        slug: singleMetaPageData.slug || '',
        metaTitle: singleMetaPageData.metaTitle || '',
        metaDescription: singleMetaPageData.metaDescription || '',
        metaKeywords: singleMetaPageData.metaKeywords || [],
        metaImage: singleMetaPageData.metaImage || null,
      });
      setThumbPreviewUrl((prev) =>
        prev === null ? singleMetaPageData.metaImage || null : prev
      );
    }
  }, [singleMetaPageData, reset]);

  //console.log('thumbPreviewUrl', thumbPreviewUrl);

  const pageKey = watch('pageKey');

  useEffect(() => {
    if (pageKey) {
      const generatedSlug = slugify(pageKey);
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [pageKey, setValue]);

  const [updateMetaInfo, { isLoading: isMetaInfoLoading }] =
    useEditMetaInfoMutation();
  const handleMetaInfoAdd = async (values) => {
    console.log('values', values);
    const {
      pageKey,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
      metaImage,
    } = values;

    // Create FormData
    const formData = new FormData();

    // Loop through values and append to FormData
    const payload = {
      pageKey,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
    };

    console.log('payload to send', payload);

    formData.append('data', JSON.stringify(payload));

    // Append image file separately if exists
    if (metaImage instanceof File) {
      formData.append('metaImage', metaImage);
    }

    try {
      const res = await updateMetaInfo({
        seoId: pageId,
        body: formData,
      }).unwrap();
      console.log('Meta info response', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Meta info updated successfully');
        refetchMetaInfo();
        setOpen(false);
      }
    } catch (error) {
      console.error('Failed to add meta info:', error);
      showErrorToast(error?.data?.message || 'Failed to update meta info');
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          reset({
            pageKey: '',
            slug: '',
            metaTitle: '',
            metaDescription: '',
            metaKeywords: [],
            metaImage: null,
          });
        }
      }}
      width="max-w-[600px]"
    >
      <h3 className="text-lg font-semibold mb-6">Edit Meta Page</h3>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-3 pb-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleMetaInfoAdd)}>
            <div className="space-y-5">
              <TextInput
                name="pageKey"
                label="Page Name"
                placeholder="Enter page name"
              />
              <TextInput name="slug" label="Slug" placeholder="Enter slug" />
              <TextInput
                name="metaTitle"
                label="Meta Title (Max 60 characters)"
                placeholder="Enter meta title"
              />
              <TextareaInput
                name="metaDescription"
                label="Meta Description (Max 160 characters)"
                placeholder="Enter meta description"
              />

              <MultipleTagsSelector
                name="metaKeywords"
                placeholder="Type and press enter to add keyword"
                label="Meta Keywords (max 200 characters)"
              />
              <FormField
                name="metaImage"
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-[var(--color-black)] font-medium block mb-2">
                      Meta Image <span className="text-red-500">*</span>
                    </label>

                    {thumbPreviewUrl ? (
                      <div className="relative inline-block mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Preview:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={thumbPreviewUrl}
                            alt="Preview"
                            className="h-[200px] rounded border border-gray-300 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              console.log('clicked');
                              setThumbPreviewUrl(null);
                              setThumbImageFile(null);
                              field.onChange(null); // reset RHF field
                            }}
                            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <FileUploader
                        name={field.name}
                        accept="image/*"
                        multiple={false}
                        icon={
                          <CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />
                        }
                        width="w-full"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;

                          // Only update RHF if the file is different
                          if (file !== field.value) {
                            field.onChange(file);
                          }

                          // Local preview state
                          setThumbImageFile(file);
                          setThumbPreviewUrl(
                            file ? URL.createObjectURL(file) : null
                          );
                        }}
                      />
                    )}

                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="text-center mt-8">
              <Button type="submit" disabled={isMetaInfoLoading}>
                {isMetaInfoLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Meta Info'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
