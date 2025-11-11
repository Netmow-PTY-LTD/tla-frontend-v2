'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CloudUpload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import TextInput from '@/components/form/TextInput';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { MultiSelect } from '@/components/form/MultiSelect';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import MultipleTagsSelector from '@/components/MultipleTagsSelector';
import SelectInput from '@/components/form/SelectInput';
import TextareaInput from '@/components/form/TextArea';
import EditorField from '@/components/inleads-editor/EditorField';
import {
  useAddBlogMutation,
  useGetBlogCategoryListQuery,
} from '@/store/features/admin/blogApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { slugify } from '@/helpers/generateSlug';

const blogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  bannerImage: z.any().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  status: z.enum(['published', 'draft']),
  metaTitle: z
    .string()
    .max(60, { message: 'Meta title must be within 60 characters' }),
  metaDescription: z
    .string()
    .min(3, { message: 'Meta description must be within 160 characters' }),
  metaKeywords: z.array(z.string()).optional(),
  metaImage: z.any().optional(),
});

export default function AddBlog() {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      bannerImage: null,
      categories: [],
      tags: [],
      status: 'published',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      metaImage: null,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    register,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [thumbPreviewUrl, setThumbPreviewUrl] = useState(null);
  const [thumbImageFile, setThumbImageFile] = useState(null);
  const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const editorRef = useRef(null);
  const [html, setHtml] = useState('');
  const [shortDescription, setShortDescription] = useState('');

  const { data: allBlogCategories } = useGetBlogCategoryListQuery();

  const blogCategories = allBlogCategories?.data || [];

  const title = watch('title');

  useEffect(() => {
    if (title) {
      const generatedSlug = slugify(title);
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, setValue]);

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      e.preventDefault();
      if (!keywords.includes(keyword.trim())) {
        const newKeywords = [...keywords, keyword.trim()];
        setKeywords(newKeywords);
        methods.setValue('metaKeywords', newKeywords);
      }
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (word) => {
    const newKeywords = keywords.filter((k) => k !== word);
    setKeywords(newKeywords);
    methods.setValue('metaKeywords', newKeywords);
  };

  const [addBlog, { isLoading: isAddBlogLoading }] = useAddBlogMutation();

  const onSubmit = async (data) => {
    // console.log('Submitted blog data', data);
    const {
      title,
      slug,
      bannerImage,
      categories,
      tags,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
      metaImage,
    } = data;

    const payload = {
      title,
      slug,
      shortDescription,
      content: html,
      category: categories,
      tags,
      status,
      seo: {
        metaTitle,
        metaDescription,
        metaKeywords,
      },
    };

    // console.log('payload to be sent', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    if (bannerImage instanceof File) {
      formData.append('bannerImage', bannerImage);
    }

    if (metaImage instanceof File) {
      formData.append('metaImage', metaImage);
    }

    try {
      const res = await addBlog(formData).unwrap();
      // console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Blog added successfully.');
        router.push('/admin/blog/list');
        reset();
        setThumbPreviewUrl(null);
        setThumbImageFile(null);
        setBannerImagePreviewUrl(null);
        setBannerImageFile(null);
        setKeywords([]); // Reset keywords
        setHtml('');
      }
    } catch (error) {
      // console.log('error', error);
      showErrorToast(error?.data?.message || 'Failed to add blog.');
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto py-10">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-300">
              <CardTitle>
                <h4>Add New Blog</h4>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <TextInput
                name="title"
                label="Blog Title"
                placeholder="Enter blog title"
              />
              <TextInput name="slug" label="Slug" placeholder="Enter slug" />
              {/* <div className="blog-form-group">
                <label htmlFor="" className="label-text inline-block mb-2">
                  Description
                </label>
                <SimpleEditor name="description" />
              </div> */}
              <EditorField
                ref={editorRef}
                name="shortDescription" // key: the hidden input name
                label="Short Description"
                value={shortDescription} // controlled
                onChange={setShortDescription}
                placeholder=" "
                height={180}
                required
              />
              <EditorField
                ref={editorRef}
                name="description" // key: the hidden input name
                label="Description"
                value={html} // controlled
                onChange={setHtml}
                placeholder=" "
                height={180}
                required
              />
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <Controller
                  name="bannerImage"
                  control={control}
                  render={({ field }) => (
                    <div>
                      {bannerImagePreviewUrl ? (
                        <div className="relative inline-block mb-2">
                          <img
                            src={bannerImagePreviewUrl}
                            alt="Preview"
                            className="h-[200px] rounded-md border border-gray-300 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setBannerImagePreviewUrl(null);
                              setBannerImageFile(null);
                              field.onChange(null);
                            }}
                            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label
                          className={cn(
                            'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition'
                          )}
                        >
                          <CloudUpload className="w-8 h-8 text-[#00C3C0]" />
                          <span className="text-sm text-gray-600">
                            Click to upload
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file !== field.value) {
                                field.onChange(file);
                              }
                              setBannerImageFile(file);
                              setBannerImagePreviewUrl(
                                file ? URL.createObjectURL(file) : null
                              );
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="pt-6">
            <CardContent className="space-y-5">
              <FormField
                control={control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={blogCategories?.map((category) => ({
                          label: category?.name,
                          value: category?._id,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select categories"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultipleTagsSelector name="tags" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SelectInput
                label="Status"
                name="status"
                options={[
                  {
                    label: 'Published',
                    value: 'published',
                  },
                  {
                    label: 'Draft',
                    value: 'draft',
                  },
                  {
                    label: 'Archived',
                    value: 'archived',
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="pt-6">
            <CardContent className="space-y-5">
              <TextInput
                label="Meta Title (Max 60 characters)"
                name="metaTitle"
                placeholder="Enter meta title"
              />
              <TextareaInput
                label="Meta Description (Max 160 characters)"
                name="metaDescription"
                placeholder="Enter meta description"
              />

              <div className="space-y-2">
                <Label>Meta Keywords (max 200 characters)</Label>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  placeholder="Type and press Enter to add keyword"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((word) => (
                    <Badge
                      key={word}
                      variant="secondary"
                      className="cursor-pointer group transition"
                      onClick={() => handleRemoveKeyword(word)}
                    >
                      {word}
                      <span className="ml-2 text-gray-400 group-hover:text-red-500">
                        ✕
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Meta Image */}
              <div className="space-y-2">
                <Label>Meta Image</Label>
                <Controller
                  name="metaImage"
                  control={control}
                  render={({ field }) => (
                    <div>
                      {thumbPreviewUrl ? (
                        <div className="relative inline-block mb-2">
                          <img
                            src={thumbPreviewUrl}
                            alt="Preview"
                            className="h-[200px] rounded-md border border-gray-300 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbPreviewUrl(null);
                              setThumbImageFile(null);
                              field.onChange(null);
                            }}
                            className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label
                          className={cn(
                            'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition'
                          )}
                        >
                          <CloudUpload className="w-8 h-8 text-[#00C3C0]" />
                          <span className="text-sm text-gray-600">
                            Click to upload
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file !== field.value) {
                                field.onChange(file);
                              }
                              setThumbImageFile(file);
                              setThumbPreviewUrl(
                                file ? URL.createObjectURL(file) : null
                              );
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <Button type="submit" disabled={isAddBlogLoading}>
              {isAddBlogLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Blog'
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
