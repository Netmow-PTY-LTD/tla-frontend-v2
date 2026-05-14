import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import EditorInput from '@/components/form/EditorInput';
import CheckboxInput from '@/components/form/CheckboxInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import {
  useGetSingleWebsiteFaqQuery,
  useUpdateWebsiteFaqMutation,
} from '@/store/features/admin/websiteFaqApiService';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const FAQ_CATEGORIES = [
  { label: 'Client', value: 'client' },
  { label: 'Lawyer', value: 'lawyer' },
  { label: 'General', value: 'general' },
];

const WEBSITE_TYPES = [
  { label: 'TLA Main Website', value: 'tla_main' },
  { label: 'Company Website', value: 'company' },
];

const faqSchema = z.object({
  question: z.string().min(1, { message: 'Question is required' }),
  answer: z.string().min(1, { message: 'Answer is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  websiteType: z.string().min(1, { message: 'Website type is required' }),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export default function EditFaqModal({
  open,
  setOpen,
  faqId,
  refetchFaqData,
}) {
  const [defaultValues, setDefaultValues] = useState({
    question: '',
    answer: '',
    category: 'general',
    websiteType: 'tla_main',
    order: 0,
    isActive: true,
  });

  const formRef = useRef(null);

  useEffect(() => {
    if (open && faqId) {
      formRef.current?.reset(defaultValues);
    }
  }, [open, faqId]);

  const { data: faqData } = useGetSingleWebsiteFaqQuery(faqId, {
    skip: !faqId,
  });

  const faq = faqData?.data;

  useEffect(() => {
    if (faq) {
      const dv = {
        question: faq.question ?? '',
        answer: faq.answer ?? '',
        category: faq.category ?? 'general',
        websiteType: faq.websiteType ?? 'tla_main',
        order: faq.order ?? 0,
        isActive: faq.isActive ?? true,
      };
      setDefaultValues(dv);

      if (open && formRef.current?.reset) {
        formRef.current.reset(dv);
      }
    }
  }, [faq, open]);

  const [updateFaq, { isLoading: isUpdateFaqLoading }] =
    useUpdateWebsiteFaqMutation();

  const handleUpdateFaq = async (values) => {
    try {
      const res = await updateFaq({ id: faqId, data: values }).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'FAQ updated successfully');
        refetchFaqData();
        setOpen(false);
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to update FAQ');
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setDefaultValues({
          question: '',
          answer: '',
          category: 'general',
          websiteType: 'tla_main',
          order: 0,
          isActive: true,
        });
      }}
      width="max-w-[800px]"
    >
      <h3 className="text-lg font-semibold mb-6">Edit FAQ</h3>
      <FormWrapper
        key={faqId}
        onSubmit={handleUpdateFaq}
        defaultValues={defaultValues}
        schema={faqSchema}
        formRef={formRef}
        ref={formRef}
      >
        <div className="grid grid-cols-1 gap-5">
          <SelectInput
            name="websiteType"
            label="Website Type"
            options={WEBSITE_TYPES}
            placeholder="Select website type"
          />
          <TextInput
            name="question"
            label="Question"
            placeholder="Enter the question"
          />
          <EditorInput
            name="answer"
            label="Answer"
            placeholder="Enter the answer"
            height={200}
          />
          <SelectInput
            name="category"
            label="Category"
            options={FAQ_CATEGORIES}
            placeholder="Select a category"
          />
          <CheckboxInput
            name="isActive"
            label="Active"
          />
        </div>

        <div className="text-center mt-6">
          <Button type="submit" disabled={isUpdateFaqLoading}>
            {isUpdateFaqLoading ? <div className='flex items-center gap-2'><Loader2 className="w-4 h-4 animate-spin" /> Updating...</div> : 'Update FAQ'}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
