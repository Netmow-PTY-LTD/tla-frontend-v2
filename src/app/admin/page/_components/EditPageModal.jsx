import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import { dummyPages } from '@/data/data';
import React, { useEffect } from 'react';
import { z } from 'zod';

const pagesSchema = z.object({
  title: z
    .string({ invalid_type_error: 'Title must be a string' })
    .min(1, { message: 'Title is required' }),
  slug: z
    .string({ invalid_type_error: 'Slug must be a string' })
    .min(1, { message: 'Slug is required' }),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .min(1, { message: 'Description is required' }),
});

export default function EditPageModal({ open, setOpen, pageId }) {
  const defaultValues = {
    title: '',
    slug: '',
    description: '',
  };

  const page = dummyPages.find((page) => page._id === pageId);

  useEffect(() => {
    if (page) {
      defaultValues.title = page.name;
      defaultValues.slug = page.slug;
      defaultValues.description = page.description;
    }
  }, [page]);

  const handlePageEdit = (values) => {
    console.log('values', values);

    const { title, slug, description } = values;

    const payload = {
      title,
      slug,
      description,
    };

    console.log('payload', payload);
  };
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <h3 className="text-lg font-semibold mb-6">Add New Page</h3>
      <FormWrapper
        onSubmit={handlePageEdit}
        defaultValues={defaultValues}
        schema={pagesSchema}
      >
        <div className="space-y-5">
          <TextInput name="title" label="Page Title" />
          <TextInput name="slug" label="Page Slug" />
          <TextareaInput name="description" label="Page Description" />
        </div>
        <div className="text-center mt-10">
          <Button type="submit">Update Page</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
