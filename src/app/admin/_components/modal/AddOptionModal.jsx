import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useAddOptionMutation } from '@/store/features/admin/optionApiService';
import { slugify } from '@/helpers/generateSlug';

export function AddOptionDialog({ open, onOpenChange, item, refetch }) {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Name is required.',
    }),
    slug: z.string().min(1, {
      message: 'Slug is required.',
    }),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const name = form.watch('name');

  useEffect(() => {
    const generatedSlug = slugify(name || '');
    form.setValue('slug', generatedSlug);
  }, [name, form.setValue]);

  //add option api call
  const [AddOption] = useAddOptionMutation();

  async function onSubmit(values) {
 
    const finalValues = {
      countryId: item?.countryId?._id,
      serviceId: item?.serviceId?._id,
      questionId: item?._id,
      ...values,
    };


    try {
      const result = await AddOption(finalValues).unwrap();
      // Optionally reset form or show success toast
      if (result) {
        showSuccessToast(result?.message);
        refetch();
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding question:', error);
      // Optionally show error toast
      showErrorToast(
        error?.data?.errorSources?.[0]?.message ||
          error?.data?.message ||
          'Failed to add question.'
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Option</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Option" {...field} />
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
                    <Input placeholder="Option Slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
