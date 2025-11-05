'use client';

import React, { useState } from 'react';
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

export default function AddBlog() {
  const methods = useForm({
    defaultValues: {
      pageKey: '',
      slug: '',
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

  const [thumbPreviewUrl, setThumbPreviewUrl] = useState(null);
  const [thumbImageFile, setThumbImageFile] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);

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

  const onSubmit = async (data) => {
    console.log('Submitted Meta Info:', data);
    await new Promise((r) => setTimeout(r, 1500)); // mock API
    reset();
    setThumbPreviewUrl(null);
    setThumbImageFile(null);
    setKeywords([]);
  };

  return (
    <div className="max-w-[900px] mx-auto py-10">
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
              <div className="blog-form-group">
                <label htmlFor="" className="label-text inline-block mb-2">
                  Description
                </label>
                <SimpleEditor name="description" />
              </div>
            </CardContent>
          </Card>

          {/* Slug */}
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              {...register('slug', { required: 'Slug is required' })}
              placeholder="Enter slug"
            />
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <Label>Meta Title (Max 60 characters)</Label>
            <Input
              {...register('metaTitle')}
              placeholder="Enter meta title"
              maxLength={60}
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label>Meta Description (Max 160 characters)</Label>
            <Textarea
              {...register('metaDescription')}
              placeholder="Enter meta description"
              rows={4}
              maxLength={160}
            />
          </div>

          {/* Meta Keywords */}
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
                        Click to upload or drag an image
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

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-40 bg-[#00C3C0] hover:bg-[#00a9a7] text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
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
  );
}
