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
  useGetBlogCategoryListQuery,
  useGetSingleBlogByIdQuery,
  useUpdateBlogMutation,
} from '@/store/features/admin/blogApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

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

export default function EditBlog() {
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState(null);
  const [thumbImageFile, setThumbImageFile] = useState(null);
  const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const editorRef = useRef(null);
  const [html, setHtml] = useState('');

  const router = useRouter();
  const params = useParams();
  const { data: singleBlogData } = useGetSingleBlogByIdQuery(params.slug, {
    skip: !params.slug,
  });

  console.log('singleBlogData', singleBlogData);
  const blog = singleBlogData?.data;

  console.log('blog', blog);

  const methods = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
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
    register,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!blog) return;

    if (blog) {
      reset({
        title: blog?.title || '',
        slug: blog?.slug || '',
        categories: blog.category?.map((c) => c._id) || [],
        tags: blog?.tags || [],
        status: blog?.status || 'published',
        metaTitle: blog?.seo?.metaTitle || '',
        metaDescription: blog?.seo?.metaDescription || '',
      });
      setHtml(blog?.content || '');
      setKeywords(blog?.seo?.metaKeywords || []);
      setThumbPreviewUrl(blog?.seo?.metaImage || '');
      setBannerImagePreviewUrl(blog?.bannerImage || '');
    }
  }, [blog]);

  const { data: allBlogCategories } = useGetBlogCategoryListQuery();
  //console.log('blogCategories', allBlogCategories);

  const blogCategories = allBlogCategories?.data || [];

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

  const [updateBlog, { isLoading: isUpdateBlogLoading }] =
    useUpdateBlogMutation();

  const onSubmit = async (data) => {
    console.log('Submitted blog data', data);
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

    const finalMetaKeywords =
      metaKeywords && metaKeywords.length > 0 ? metaKeywords : keywords;

    const finalMetaImage = metaImage instanceof File ? metaImage : null;

    const finalBannerImage = bannerImage instanceof File ? bannerImage : null;

    const payload = {
      title,
      slug,
      content: html,
      category: categories,
      tags,
      status,
      seo: {
        metaTitle,
        metaDescription,
        metaKeywords: finalMetaKeywords,
      },
    };

    console.log('payload to be sent', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    if (finalBannerImage instanceof File) {
      formData.append('bannerImage', finalBannerImage);
    } else {
      formData.append('bannerImage', null);
    }

    if (finalMetaImage instanceof File) {
      formData.append('metaImage', finalMetaImage);
    } else {
      formData.append('metaImage', null);
    }

    try {
      const res = await updateBlog({
        blogId: blog?._id,
        data: formData,
      }).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Blog Updated successfully.');
        router.push('/admin/blog/list');
      }
    } catch (error) {
      console.log('error', error);
      showErrorToast(error?.data?.message || 'Failed to update blog.');
    }
  };

  return (
    <div className="max-w-[900px] mx-auto py-10">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-300">
              <CardTitle>
                <h4>Update Blog</h4>
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
                          label: category.name,
                          value: category._id,
                        }))}
                        value={field.value} // array of IDs
                        onChange={(selectedIds) => field.onChange(selectedIds)}
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
                  {keywords?.map((word) => (
                    <Badge
                      key={word} // use the keyword itself
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
                      {thumbPreviewUrl && thumbPreviewUrl !== null ? (
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
            <Button type="submit" disabled={isUpdateBlogLoading}>
              {isUpdateBlogLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Blog'
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
