import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import { dummyPages } from '@/data/data';
import {
  useGetPageByIdQuery,
  useUpdatePageMutation,
} from '@/store/features/admin/pagesApiService';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

const pagesSchema = z.object({
  title: z
    .string({ invalid_type_error: 'Title must be a string' })
    .min(1, { message: 'Title is required' }),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .min(1, { message: 'Description is required' }),
});

export default function EditPageModal({ open, setOpen, pageId, refetchPages }) {
  const [defaultValues, setDefaultValues] = useState({
    title: '',
    description: '',
  });

  const { data: pageData } = useGetPageByIdQuery(pageId, { skip: !pageId });

  const page = pageData?.data;

  useEffect(() => {
    if (page) {
      setDefaultValues({
        title: page?.title,
        description: page?.description,
      });
    }
  }, [page]);

  const [updatePage, { isLoading: isPageUpdateLoading }] =
    useUpdatePageMutation();
  const handlePageEdit = async (values) => {
    const { title, description } = values;

    const payload = {
      title,
      description,
    };

    // console.log('payload', payload);

    try {
      const res = await updatePage({ pageId, body: payload }).unwrap();
      // console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Page updated successfully');
        refetchPages();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error updating page:', error);
      showErrorToast(error?.data?.message || 'Failed to update page');
    }
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
          <TextareaInput name="description" label="Page Description" />
        </div>
        <div className="text-center mt-10">
          <Button type="submit" disabled={isPageUpdateLoading}>
            {isPageUpdateLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin w-4 h-4" /> Updating...
              </div>
            ) : (
              'Update Page'
            )}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
