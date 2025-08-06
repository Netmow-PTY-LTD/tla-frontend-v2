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
import {
  useAddOptionMutation,
  useEditOptionMutation,
} from '@/store/features/admin/optionApiService';
import { slugify } from '@/helpers/generateSlug';

export function EditOptionDialog({
  open,
  onOpenChange,
  item,
  question,
  refetch,
}) {

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

  useEffect(() => {
    if (item) {
      form.reset({
        name: item?.name || '',
        slug: item?.slug || '',
      });
    }
  }, [item, form]);

  //add option api call
  const [editOption] = useEditOptionMutation();

  async function onSubmit(values) {

    const updatedValues = {
      ...values,
      id: item?._id,
      countryId: question?.countryId?._id,
      serviceId: question?.serviceId?._id,
      questionId: question?._id,
      selected_options: [],
    };

   
    try {
      const result = await editOption(updatedValues).unwrap();
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
          <DialogTitle>Edit Option</DialogTitle>
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
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
