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
import { useUpdateHeaderFooterCodeMutation, useGetHeaderFooterCodeByIdQuery } from '@/store/features/seo/seoApi';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  code: z.string().min(2, {
    message: 'Code must be at least 2 characters.',
  }),
  position: z.enum(['header', 'footer']),
  isActive: z.boolean(),
});

export default function EditCodeModal({ id, open, onClose }) {
  const [localLoading, setLocalLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      code: '',
      position: 'header',
      isActive: true,
    },
  });

  const {
    data: singleCode,
    isSuccess,
    refetch,
  } = useGetHeaderFooterCodeByIdQuery(id, {
    skip: !id || !open,
  });

  const [editCode, { isLoading: isSubmitting }] = useUpdateHeaderFooterCodeMutation();

  useEffect(() => {
    if (open && id) {
      setLocalLoading(true);
      refetch();
    }
  }, [open, id, refetch]);

  useEffect(() => {
    if (isSuccess && singleCode) {
      form.reset({
        title: singleCode?.data?.title || '',
        code: singleCode?.data?.code || '',
        position: singleCode?.data?.position || 'header',
        isActive: singleCode?.data?.isActive,
      });
      setLocalLoading(false);
    }
  }, [isSuccess, singleCode, form]);

  async function onSubmit(values) {
    try {
      const res = await editCode({ id, ...values }).unwrap();
      showSuccessToast(res?.message || 'Code updated successfully!');
      onClose();
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Header/Footer Code</DialogTitle>
        </DialogHeader>

        {localLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading code details...
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="header">Header</option>
                        <option value="footer">Footer</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your HTML/JS code here"
                        className="font-mono resize-none h-32"
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
                {isSubmitting ? 'Updating...' : 'Update Code'}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}