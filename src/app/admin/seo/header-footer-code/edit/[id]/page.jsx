'use client';
import React, { useEffect, useState } from 'react';
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
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  useUpdateHeaderFooterCodeMutation,
  useGetHeaderFooterCodeByIdQuery,
} from '@/store/features/seo/seoApi';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  code: z.string().min(2, {
    message: 'Code must be at least 2 characters.',
  }),
  position: z.enum(['header', 'footer']),
  notes: z.string(),
  isActive: z.boolean(),
});

export default function EditCodePage() {
  const params = useParams();
  const id = params?.id;

  const [localLoading, setLocalLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      code: '',
      notes: '',
      position: 'header',
      isActive: true,
    },
  });

  const {
    data: singleCode,
    isSuccess,
    refetch,
  } = useGetHeaderFooterCodeByIdQuery(id, {
    skip: !id,
  });

  const [editCode, { isLoading: isSubmitting }] =
    useUpdateHeaderFooterCodeMutation();

  useEffect(() => {
    if (id) {
      setLocalLoading(true);
      refetch();
    }
  }, [id, refetch]);

  useEffect(() => {
    if (isSuccess && singleCode) {
      form.reset({
        title: singleCode?.data?.title || '',
        code: singleCode?.data?.code || '',
        notes: singleCode?.data?.notes || '',
        position: singleCode?.data?.position || 'header',
        isActive: singleCode?.data?.isActive,
      });
      setLocalLoading(false);
    }
  }, [isSuccess, singleCode, form]);

  async function onSubmit(values) {
    try {
      const res = await editCode({ id, data: values }).unwrap();
      console.log('res', res);
      showSuccessToast(res?.message || 'Code updated successfully!');
    } catch (error) {
      const backendMessage =
        error?.data?.err?.errorSources?.[0]?.message ||
        error?.data?.message ||
        'Failed to update code.';
      showErrorToast(backendMessage);
      console.error('Error updating code:', error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/seo/header-footer-code">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Edit Header/Footer Code</h1>
        </div>
      </div>

      {localLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading code details...
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Code Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Position */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="header">Header</option>
                      <option value="footer">Footer</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code (Auto-Resizing Textarea) */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => {
                const textareaRef = React.useRef(null);

                const handleInput = (e) => {
                  const textarea = e.target;
                  textarea.style.height = 'auto';
                  textarea.style.height = textarea.scrollHeight + 'px';
                  field.onChange(e);
                };

                useEffect(() => {
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height =
                      textareaRef.current.scrollHeight + 'px';
                  }
                }, []);

                return (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        onInput={handleInput}
                        placeholder="Enter your HTML/JS code here"
                        className="font-mono resize-none overflow-hidden min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notes here"
                      className="font-mono resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
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

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Updating...' : 'Update Code'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
