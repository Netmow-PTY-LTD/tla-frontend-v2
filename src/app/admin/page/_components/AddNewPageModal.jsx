import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import { useAddPageMutation } from '@/store/features/admin/pagesApiService';
import React from 'react';
import { z } from 'zod';

const pagesSchema = z.object({
  title: z
    .string({ invalid_type_error: 'Title must be a string' })
    .min(1, { message: 'Title is required' }),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .min(1, { message: 'Description is required' }),
});

export default function AddNewPageModal({ open, setOpen, refetchPages }) {
  const defaultValues = {
    title: '',
    description: '',
  };

  const [addPage] = useAddPageMutation();
  const handlePageAdd = async (values) => {
    console.log('values', values);

    const { title, description } = values;

    const payload = {
      title,
      description,
    };

    console.log('payload', payload);

    try {
      const res = await addPage(payload).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Page added successfully');
        refetchPages();
        setOpen(false);
      }
    } catch (error) {
      console.error('Failed to add page:', error);
      showErrorToast(error?.data?.message || 'Failed to add page');
    }
  };
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <h3 className="text-lg font-semibold mb-6">Add New Page</h3>
      <FormWrapper
        onSubmit={handlePageAdd}
        defaultValues={defaultValues}
        schema={pagesSchema}
      >
        <div className="space-y-5">
          <TextInput
            name="title"
            label="Page Title"
            placeholder="Enter page title"
          />
          <TextareaInput
            name="description"
            label="Page Description"
            placeholder="Enter page description"
          />
        </div>
        <div className="text-center mt-10">
          <Button type="submit">Add Page</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
