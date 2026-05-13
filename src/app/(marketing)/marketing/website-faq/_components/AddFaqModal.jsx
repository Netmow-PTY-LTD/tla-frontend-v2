import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import TextArea from '@/components/form/TextArea';
import CheckboxInput from '@/components/form/CheckboxInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import { showSuccessToast } from '@/components/common/toasts';
import { useCreateWebsiteFaqMutation } from '@/store/features/admin/websiteFaqApiService';
import { z } from 'zod';

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

export default function AddFaqModal({ open, setOpen, refetchFaqData }) {
  const defaultValues = {
    question: '',
    answer: '',
    category: 'general',
    websiteType: 'tla_main',
    order: 0,
    isActive: true,
  };

  const [createFaq] = useCreateWebsiteFaqMutation();

  const handleAddFaq = async (values) => {
    try {
      const res = await createFaq(values).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'FAQ added successfully');
        refetchFaqData();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <h3 className="text-lg font-semibold mb-6">Add FAQ</h3>
      <FormWrapper
        onSubmit={handleAddFaq}
        defaultValues={defaultValues}
        schema={faqSchema}
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
          <TextArea
            name="answer"
            label="Answer"
            placeholder="Enter the answer"
            rows={4}
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
          <Button type="submit">Add FAQ</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
