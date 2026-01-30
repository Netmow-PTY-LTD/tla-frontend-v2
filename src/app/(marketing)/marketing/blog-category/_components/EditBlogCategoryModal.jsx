'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';

import { Loader2 } from 'lucide-react';
import { useEditBlogCategoryMutation, useGetSingleBlogCategoryQuery } from '@/store/features/admin/blogApiService';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Category name must be at least 2 characters.',
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  isActive: z.boolean(),
});

export default function EditBlogCategoryModal({ id, open, onClose }) {
  const [localLoading, setLocalLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
    },
  });

  const {
    data: singleCategory,
    isSuccess,
    refetch,
  } = useGetSingleBlogCategoryQuery(id, {
    skip: !id || !open,
  });

  const [editCategory, { isLoading: isSubmitting }] = useEditBlogCategoryMutation();

  useEffect(() => {
    if (open && id) {
      setLocalLoading(true);
      refetch();
    }
  }, [open, id, refetch]);

  useEffect(() => {
    if (isSuccess && singleCategory) {
      form.reset({
        name: singleCategory?.data?.name || '',
        slug: singleCategory?.data?.slug || '',
        description: singleCategory?.data?.description || '',
        isActive: singleCategory?.data?.isActive,
      });
      setLocalLoading(false);
    }
  }, [isSuccess, singleCategory, form]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    form.setValue('name', name);
    form.setValue('slug', generateSlug(name));
  };

  async function onSubmit(values) {
    try {
      const res = await editCategory({ id, ...values }).unwrap();
      showSuccessToast(res?.message || 'Category updated successfully!');
      onClose();
    } catch (error) {
      const backendMessage =
        error?.data?.err?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to update category.';
      showErrorToast(backendMessage);
      console.error('Error updating category:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Blog Category</DialogTitle>
        </DialogHeader>

        {localLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading category details...
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Category Name" 
                        {...field}
                        onChange={handleNameChange}
                      />
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
                      <Input 
                        placeholder="category-slug" 
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Category Description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Category'}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}