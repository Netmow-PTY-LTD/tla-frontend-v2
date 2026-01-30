'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CloudUpload, Loader2, X } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import EditorField from '@/components/inleads-editor/EditorField';
import {
  useGetSingleBlogBySlugQuery,
  useUpdateBlogMutation,
  useGetBlogCategoryListQuery,
} from '@/store/features/admin/blogApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { slugify } from '@/helpers/generateSlug';

const blogSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  excerpt: z.string().optional(),
  featuredImage: z.any().optional(),
  featuredImageAlt: z.string().optional(),
  featuredImageTitle: z.string().optional(),
  featuredImageDescription: z.string().optional(),
  authors: z.array(z.string()).optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  status: z.enum(['published', 'draft', 'archived']),
  isFeatured: z.boolean().optional(),
  metaTitle: z
    .string()
    .max(60, { message: 'Meta title must be within 60 characters' }),
  metaDescription: z
    .string()
    .min(3, { message: 'Meta description must be within 160 characters' }),
  metaKeywords: z.array(z.string()).optional(),
  metaImage: z.any().optional(),
  canonicalUrl: z.string().optional(),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
  schemaType: z.string().optional(),
  seoSchema: z.string().optional(),
});

export default function EditBlog() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const methods = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      description: '',
      featuredImage: null,
      featuredImageAlt: '',
      featuredImageTitle: '',
      featuredImageDescription: '',
      authors: [],
      categories: [],
      tags: [],
      status: 'published',
      isFeatured: false,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      metaImage: null,
      canonicalUrl: '',
      noIndex: false,
      noFollow: false,
      schemaType: 'Article',
      seoSchema: '',
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
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [author, setAuthor] = useState('');
  const [authors, setAuthors] = useState([]);
  const editorRef = useRef(null);
  const [html, setHtml] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [blogId, setBlogId] = useState(null);

  const { data: blogData, isLoading: isBlogLoading } = useGetSingleBlogBySlugQuery(slug, {
    skip: !slug,
  });
  const { data: allBlogCategories } = useGetBlogCategoryListQuery();

  const blogCategories = allBlogCategories?.data || [];

  const title = watch('title');

  useEffect(() => {
    if (title && !blogData) {
      const generatedSlug = slugify(title);
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, setValue, blogData]);

  // Populate form with existing blog data
  useEffect(() => {
    if (blogData?.data) {
      const blog = blogData.data;
      setBlogId(blog._id);

      // Set basic fields
      reset({
        title: blog.title || '',
        slug: blog.slug || '',
        featuredImageAlt: blog.featuredImage?.alt || '',
        featuredImageTitle: blog.featuredImage?.title || '',
        featuredImageDescription: blog.featuredImage?.description || '',
        categories: blog.category?.map((cat) => cat._id || cat) || [],
        tags: blog.tags || [],
        status: blog.status || 'published',
        isFeatured: blog.isFeatured || false,
        metaTitle: blog.seo?.metaTitle || '',
        metaDescription: blog.seo?.metaDescription || '',
        canonicalUrl: blog.seo?.canonicalUrl || '',
        noIndex: blog.seo?.noIndex || false,
        noFollow: blog.seo?.noFollow || false,
        schemaType: blog.seo?.schemaType || 'Article',
        seoSchema: blog.seoSchema ? JSON.stringify(blog.seoSchema, null, 2) : '',
      });

      // Set excerpt and content
      setExcerpt(blog.excerpt || '');
      setHtml(blog.content || '');

      // Set authors
      if (blog.authors && Array.isArray(blog.authors)) {
        setAuthors(blog.authors);
        setValue('authors', blog.authors);
      }

      // Set meta keywords
      if (blog.seo?.metaKeywords && Array.isArray(blog.seo.metaKeywords)) {
        setKeywords(blog.seo.metaKeywords);
        setValue('metaKeywords', blog.seo.metaKeywords);
      }

      // Set featured image preview
      if (blog.featuredImage?.url) {
        setFeaturedImagePreviewUrl(blog.featuredImage.url);
      }

      // Set meta image preview
      if (blog.seo?.metaImage) {
        setThumbPreviewUrl(blog.seo.metaImage);
      }
    }
  }, [blogData, reset, setValue]);

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

  const handleAddAuthor = (e) => {
    if (e.key === 'Enter' && author.trim() !== '') {
      e.preventDefault();
      if (!authors.includes(author.trim())) {
        const newAuthors = [...authors, author.trim()];
        setAuthors(newAuthors);
        methods.setValue('authors', newAuthors);
      }
      setAuthor('');
    }
  };

  const handleRemoveAuthor = (name) => {
    const newAuthors = authors.filter((a) => a !== name);
    setAuthors(newAuthors);
    methods.setValue('authors', newAuthors);
  };

  const [updateBlog, { isLoading: isUpdateBlogLoading }] = useUpdateBlogMutation();

  const onSubmit = async (data) => {
    if (!blogId) {
      showErrorToast('Blog ID not found.');
      return;
    }

    const {
      title,
      slug,
      featuredImage,
      featuredImageAlt,
      featuredImageTitle,
      featuredImageDescription,
      authors,
      categories,
      tags,
      status,
      isFeatured,
      metaTitle,
      metaDescription,
      metaKeywords,
      metaImage,
      canonicalUrl,
      noIndex,
      noFollow,
      schemaType,
      seoSchema,
    } = data;


  //    const finalMetaKeywords =
  // metaKeywords && metaKeywords.length > 0 ? metaKeywords : keywords;

const finalMetaImage = metaImage instanceof File ? metaImage : null;
const finalFeaturedImage = featuredImage instanceof File ? featuredImage : null;


    const payload = {
      title,
      slug,
      excerpt,
      content: html,
      featuredImage: {
        alt: featuredImageAlt,
        title: featuredImageTitle,
        description: featuredImageDescription,
      },
      authors,
      category: categories,
      tags,
      status,
      isFeatured,
      seo: {
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        noIndex,
        noFollow,
        schemaType,
      },
      seoSchema: seoSchema ? JSON.parse(seoSchema) : undefined,
    };



   


const formData = new FormData();
formData.append('data', JSON.stringify(payload));

if (finalFeaturedImage instanceof File) {
  formData.append('featuredImage', finalFeaturedImage);
} else {
  formData.append('featuredImage', null);
}

if (finalMetaImage instanceof File) {
  formData.append('metaImage', finalMetaImage);
} else {
  formData.append('metaImage', null);
}





    // const formData = new FormData();
    // formData.append('data', JSON.stringify(payload));

    // if (featuredImage instanceof File) {
    //   formData.append('featuredImage', featuredImage);
    // }

    // if (metaImage instanceof File) {
    //   formData.append('metaImage', metaImage);
    // }

    try {
      const res = await updateBlog({ blogId, data: formData }).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'Blog updated successfully.');
        router.push('/admin/blog/list');
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to update blog.');
    }
  };

  if (isBlogLoading) {
    return (
      <div className="max-w-[1000px] mx-auto py-10 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading blog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto py-10">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-300">
              <CardTitle>
                <h4>Edit Blog</h4>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <TextInput
                name="title"
                label="Blog Title"
                placeholder="Enter blog title"
              />
              <TextInput name="slug" label="Slug" placeholder="Enter slug" />
              <EditorField
                ref={editorRef}
                name="excerpt"
                label="Short Description"
                value={excerpt}
                onChange={setExcerpt}
                placeholder="Brief summary of the blog post"
                height={120}
              />
              <EditorField
                ref={editorRef}
                name="description"
                label="Content"
                value={html}
                onChange={setHtml}
                placeholder="Write your blog content here..."
                height={400}
                required
              />
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <Controller
                  name="featuredImage"
                  control={control}
                  render={({ field }) => (
                    <div>
                      {featuredImagePreviewUrl ? (
                        <div className="relative inline-block mb-2">
                          <img
                            src={featuredImagePreviewUrl}
                            alt="Preview"
                            className="h-[200px] rounded-md border border-gray-300 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFeaturedImagePreviewUrl(null);
                              setFeaturedImageFile(null);
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
                              setFeaturedImageFile(file);
                              setFeaturedImagePreviewUrl(
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
              {/* Featured Image Metadata */}
              <TextInput
                name="featuredImageAlt"
                label="Featured Image Alt Text"
                placeholder="Describe the featured image for accessibility"
              />
              <TextInput
                name="featuredImageTitle"
                label="Featured Image Title"
                placeholder="Title for the featured image"
              />
              <TextareaInput
                name="featuredImageDescription"
                label="Featured Image Description"
                placeholder="Detailed description of the featured image"
              />
            </CardContent>
          </Card>
          <Card className="pt-6">
            <CardContent className="space-y-5">
              {/* Authors */}
              <div className="space-y-2">
                <Label>Authors</Label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onKeyDown={handleAddAuthor}
                  placeholder="Type author name and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {authors.map((name) => (
                    <Badge
                      key={name}
                      variant="secondary"
                      className="cursor-pointer group transition"
                      onClick={() => handleRemoveAuthor(name)}
                    >
                      {name}
                      <span className="ml-2 text-gray-400 group-hover:text-red-500">
                        ✕
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
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
              {/* Is Featured */}
              <FormField
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Featured Post
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        Mark this blog post as featured
                      </p>
                    </div>
                  </FormItem>
                )}
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
              {/* Canonical URL */}
              <TextInput
                label="Canonical URL"
                name="canonicalUrl"
                placeholder="https://yoursite.com/blog/post-slug"
              />
              {/* Schema Type */}
              <SelectInput
                label="Schema Type"
                name="schemaType"
                options={[
                  { label: 'Article', value: 'Article' },
                  { label: 'BlogPosting', value: 'BlogPosting' },
                  { label: 'NewsArticle', value: 'NewsArticle' },
                  { label: 'WebPage', value: 'WebPage' },
                ]}
              />
              {/* No Index / No Follow */}
              <div className="flex gap-6">
                <FormField
                  control={control}
                  name="noIndex"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>No Index</FormLabel>
                        <p className="text-sm text-gray-500">
                          Prevent search engines from indexing this page
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="noFollow"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>No Follow</FormLabel>
                        <p className="text-sm text-gray-500">
                          Prevent search engines from following links on this page
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              {/* SEO Schema JSON */}
              <TextareaInput
                label="SEO Schema (JSON)"
                name="seoSchema"
                placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                rows={6}
              />
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







//  previous code 


// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { useForm, FormProvider, Controller } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { CloudUpload, Loader2 } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import TextInput from '@/components/form/TextInput';
// import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
// import { MultiSelect } from '@/components/form/MultiSelect';
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import MultipleTagsSelector from '@/components/MultipleTagsSelector';
// import SelectInput from '@/components/form/SelectInput';
// import TextareaInput from '@/components/form/TextArea';
// import {
//   useGetBlogCategoryListQuery,
//   useGetSingleBlogByIdQuery,
//   useGetSingleBlogBySlugQuery,
//   useUpdateBlogMutation,
// } from '@/store/features/admin/blogApiService';
// import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
// import z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useParams, useRouter } from 'next/navigation';
// import EditorField from '@/components/inleads-editor/EditorField';
// import { slugify } from '@/helpers/generateSlug';

// const blogSchema = z.object({
//   title: z.string().min(1, { message: 'Title is required' }),
//   slug: z.string().min(1, { message: 'Slug is required' }),
//   bannerImage: z.any().optional(),
//   categories: z.array(z.string()),
//   tags: z.array(z.string()),
//   status: z.enum(['published', 'draft']),
//   metaTitle: z
//     .string()
//     .max(60, { message: 'Meta title must be within 60 characters' }),
//   metaDescription: z
//     .string()
//     .min(3, { message: 'Meta description must be within 160 characters' }),
//   metaKeywords: z.array(z.string()).optional(),
//   metaImage: z.any().optional(),
// });

// export default function EditBlog() {
//   const [thumbPreviewUrl, setThumbPreviewUrl] = useState(null);
//   const [thumbImageFile, setThumbImageFile] = useState(null);
//   const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = useState(null);
//   const [bannerImageFile, setBannerImageFile] = useState(null);
//   const [keyword, setKeyword] = useState('');
//   const [keywords, setKeywords] = useState([]);
//   const editorRef = useRef(null);
//   const [html, setHtml] = useState('');
//   const [shortDescription, setShortDescription] = useState('');

//   const router = useRouter();
//   const params = useParams();
//   const { data: singleBlogData } = useGetSingleBlogBySlugQuery(params.slug, {
//     skip: !params.slug,
//   });

//   console.log('singleBlogData', singleBlogData);
//   const blog = singleBlogData?.data;

//   const methods = useForm({
//     resolver: zodResolver(blogSchema),
//     defaultValues: {
//       title: '',
//       slug: '',
//       shortDescription: '',
//       description: '',
//       bannerImage: null,
//       categories: [],
//       tags: [],
//       status: 'published',
//       metaTitle: '',
//       metaDescription: '',
//       metaKeywords: [],
//       metaImage: null,
//     },
//   });

//   const {
//     handleSubmit,
//     control,
//     watch,
//     setValue,
//     register,
//     reset,
//     formState: { isSubmitting },
//   } = methods;

//   useEffect(() => {
//     if (!blog) return;

//     if (blog) {
//       reset({
//         title: blog?.title || '',
//         slug: blog?.slug || '',
//         categories: blog.category?.map((c) => c._id) || [],
//         tags: blog?.tags || [],
//         status: blog?.status || 'published',
//         metaTitle: blog?.seo?.metaTitle || '',
//         metaDescription: blog?.seo?.metaDescription || '',
//       });
//       setShortDescription(blog?.shortDescription || '');
//       setHtml(blog?.content || '');
//       setKeywords(blog?.seo?.metaKeywords || []);
//       setThumbPreviewUrl(blog?.seo?.metaImage || '');
//       setBannerImagePreviewUrl(blog?.bannerImage || '');
//     }
//   }, [blog]);

//   const { data: allBlogCategories } = useGetBlogCategoryListQuery();
//   //console.log('blogCategories', allBlogCategories);

//   const blogCategories = allBlogCategories?.data || [];

//   const title = watch('title');

//   useEffect(() => {
//     if (title) {
//       const generatedSlug = slugify(title);
//       setValue('slug', generatedSlug, { shouldValidate: true });
//     }
//   }, [title, setValue]);

//   const handleAddKeyword = (e) => {
//     if (e.key === 'Enter' && keyword.trim() !== '') {
//       e.preventDefault();
//       if (!keywords.includes(keyword.trim())) {
//         const newKeywords = [...keywords, keyword.trim()];
//         setKeywords(newKeywords);
//         methods.setValue('metaKeywords', newKeywords);
//       }
//       setKeyword('');
//     }
//   };

//   const handleRemoveKeyword = (word) => {
//     const newKeywords = keywords.filter((k) => k !== word);
//     setKeywords(newKeywords);
//     methods.setValue('metaKeywords', newKeywords);
//   };

//   const [updateBlog, { isLoading: isUpdateBlogLoading }] =
//     useUpdateBlogMutation();

//   const onSubmit = async (data) => {
//     // console.log('Submitted blog data', data);
//     const {
//       title,
//       slug,
//       bannerImage,
//       categories,
//       tags,
//       status,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//       metaImage,
//     } = data;

//     const finalMetaKeywords =
//       metaKeywords && metaKeywords.length > 0 ? metaKeywords : keywords;

//     const finalMetaImage = metaImage instanceof File ? metaImage : null;

//     const finalBannerImage = bannerImage instanceof File ? bannerImage : null;

//     const payload = {
//       title,
//       slug,
//       shortDescription,
//       content: html,
//       category: categories,
//       tags,
//       status,
//       seo: {
//         metaTitle,
//         metaDescription,
//         metaKeywords: finalMetaKeywords,
//       },
//     };

//     // console.log('payload to be sent', payload);

//     const formData = new FormData();
//     formData.append('data', JSON.stringify(payload));

//     if (finalBannerImage instanceof File) {
//       formData.append('bannerImage', finalBannerImage);
//     } else {
//       formData.append('bannerImage', null);
//     }

//     if (finalMetaImage instanceof File) {
//       formData.append('metaImage', finalMetaImage);
//     } else {
//       formData.append('metaImage', null);
//     }

//     try {
//       const res = await updateBlog({
//         blogId: blog?._id,
//         data: formData,
//       }).unwrap();
//       // console.log('res', res);
//       if (res?.success) {
//         showSuccessToast(res?.message || 'Blog Updated successfully.');
//         router.push('/admin/blog/list');
//       }
//     } catch (error) {
//       // console.log('error', error);
//       showErrorToast(error?.data?.message || 'Failed to update blog.');
//     }
//   };

//   return (
//     <div className="max-w-[1000px] mx-auto py-10">
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <Card>
//             <CardHeader className="border-b border-gray-300">
//               <CardTitle>
//                 <h4>Update Blog</h4>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 pt-4">
//               <TextInput
//                 name="title"
//                 label="Blog Title"
//                 placeholder="Enter blog title"
//               />
//               <TextInput name="slug" label="Slug" placeholder="Enter slug" />
//               {/* <div className="blog-form-group">
//                 <label htmlFor="" className="label-text inline-block mb-2">
//                   Description
//                 </label>
//                 <SimpleEditor name="description" />
//               </div> */}
//               <EditorField
//                 ref={editorRef}
//                 name="shortDescription" // key: the hidden input name
//                 label="Short Description"
//                 value={shortDescription} // controlled
//                 onChange={setShortDescription}
//                 placeholder=" "
//                 height={180}
//                 required
//               />
//               <EditorField
//                 ref={editorRef}
//                 name="description" // key: the hidden input name
//                 label="Description"
//                 value={html} // controlled
//                 onChange={setHtml}
//                 placeholder=" "
//                 height={180}
//                 required
//               />
//               <div className="space-y-2">
//                 <Label>Featured Image</Label>
//                 <Controller
//                   name="bannerImage"
//                   control={control}
//                   render={({ field }) => (
//                     <div>
//                       {bannerImagePreviewUrl ? (
//                         <div className="relative inline-block mb-2">
//                           <img
//                             src={bannerImagePreviewUrl}
//                             alt="Preview"
//                             className="h-[200px] rounded-md border border-gray-300 object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setBannerImagePreviewUrl(null);
//                               setBannerImageFile(null);
//                               field.onChange(null);
//                             }}
//                             className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
//                             title="Remove"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       ) : (
//                         <label
//                           className={cn(
//                             'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition'
//                           )}
//                         >
//                           <CloudUpload className="w-8 h-8 text-[#00C3C0]" />
//                           <span className="text-sm text-gray-600">
//                             Click to upload
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={(e) => {
//                               const file = e.target.files?.[0] || null;
//                               if (file !== field.value) {
//                                 field.onChange(file);
//                               }
//                               setBannerImageFile(file);
//                               setBannerImagePreviewUrl(
//                                 file ? URL.createObjectURL(file) : null
//                               );
//                             }}
//                           />
//                         </label>
//                       )}
//                     </div>
//                   )}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="pt-6">
//             <CardContent className="space-y-5">
//               <FormField
//                 control={control}
//                 name="categories"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Categories</FormLabel>
//                     <FormControl>
//                       <MultiSelect
//                         options={blogCategories?.map((category) => ({
//                           label: category.name,
//                           value: category._id,
//                         }))}
//                         value={field.value} // array of IDs
//                         onChange={(selectedIds) => field.onChange(selectedIds)}
//                         placeholder="Select categories"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={control}
//                 name="categories"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Tags</FormLabel>
//                     <FormControl>
//                       <MultipleTagsSelector name="tags" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <SelectInput
//                 label="Status"
//                 name="status"
//                 options={[
//                   {
//                     label: 'Published',
//                     value: 'published',
//                   },
//                   {
//                     label: 'Draft',
//                     value: 'draft',
//                   },
//                   {
//                     label: 'Archived',
//                     value: 'archived',
//                   },
//                 ]}
//               />
//             </CardContent>
//           </Card>

//           <Card className="pt-6">
//             <CardContent className="space-y-5">
//               <TextInput
//                 label="Meta Title (Max 60 characters)"
//                 name="metaTitle"
//                 placeholder="Enter meta title"
//               />
//               <TextareaInput
//                 label="Meta Description (Max 160 characters)"
//                 name="metaDescription"
//                 placeholder="Enter meta description"
//               />

//               <div className="space-y-2">
//                 <Label>Meta Keywords (max 200 characters)</Label>
//                 <Input
//                   value={keyword}
//                   onChange={(e) => setKeyword(e.target.value)}
//                   onKeyDown={handleAddKeyword}
//                   placeholder="Type and press Enter to add keyword"
//                 />
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {keywords?.map((word) => (
//                     <Badge
//                       key={word} // use the keyword itself
//                       variant="secondary"
//                       className="cursor-pointer group transition"
//                       onClick={() => handleRemoveKeyword(word)}
//                     >
//                       {word}
//                       <span className="ml-2 text-gray-400 group-hover:text-red-500">
//                         ✕
//                       </span>
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//               {/* Meta Image */}
//               <div className="space-y-2">
//                 <Label>Meta Image</Label>
//                 <Controller
//                   name="metaImage"
//                   control={control}
//                   render={({ field }) => (
//                     <div>
//                       {thumbPreviewUrl && thumbPreviewUrl !== null ? (
//                         <div className="relative inline-block mb-2">
//                           <img
//                             src={thumbPreviewUrl}
//                             alt="Preview"
//                             className="h-[200px] rounded-md border border-gray-300 object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setThumbPreviewUrl(null);
//                               setThumbImageFile(null);
//                               field.onChange(null);
//                             }}
//                             className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
//                             title="Remove"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       ) : (
//                         <label
//                           className={cn(
//                             'flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition'
//                           )}
//                         >
//                           <CloudUpload className="w-8 h-8 text-[#00C3C0]" />
//                           <span className="text-sm text-gray-600">
//                             Click to upload
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={(e) => {
//                               const file = e.target.files?.[0] || null;
//                               if (file !== field.value) {
//                                 field.onChange(file);
//                               }
//                               setThumbImageFile(file);
//                               setThumbPreviewUrl(
//                                 file ? URL.createObjectURL(file) : null
//                               );
//                             }}
//                           />
//                         </label>
//                       )}
//                     </div>
//                   )}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Submit Button */}
//           <div className="pt-4 text-center">
//             <Button type="submit" disabled={isUpdateBlogLoading}>
//               {isUpdateBlogLoading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   <span>Updating...</span>
//                 </div>
//               ) : (
//                 'Update Blog'
//               )}
//             </Button>
//           </div>
//         </form>
//       </FormProvider>
//     </div>
//   );
// }