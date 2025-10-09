import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React from 'react';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';
import { showSuccessToast } from '@/components/common/toasts';
import { useCreateTestimonialMutation } from '@/store/features/testimonials/testimonialsService';
import { z } from 'zod';
import TextArea from '@/components/form/TextArea';

const testimonialSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Name is required' })
    .min(1, { message: 'Name is required' }),
  comment: z
    .string({ invalid_type_error: 'Comment is required' })
    .min(1, { message: 'Comment is required' }),
  image: z.any().optional(),
});

export default function AddTestimonialModal({ open, setOpen, refetchTestimonialData }) {
  const defaultValues = {
    name: '',
    comment: '',
    image: null,
  };

  const [addTestimonial] = useCreateTestimonialMutation();

  const handleAddTestimonial = async (values) => {
    console.log('values', values);

    const { name, comment, image } = values;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('comment', comment);

    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      const res = await addTestimonial(formData).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Testimonial added successfully');
        refetchTestimonialData();
        setOpen(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <h3 className="text-lg font-semibold mb-6">Add Testimonial</h3>
      <FormWrapper
        onSubmit={handleAddTestimonial}
        defaultValues={defaultValues}
        schema={testimonialSchema}
      >
        <div className="grid grid-cols-1 gap-5">
          <TextInput
            name="name"
            label="Name"
            placeholder="Input name here"
          />
          <TextArea
            name="comment"
            label="Comment"
            placeholder="Write your comment here"
          />
          <div className="flex flex-col gap-3">
            <label htmlFor="image" className="label-text">
              Upload Photo
            </label>
            <AvatarUploader name="image" />
          </div>
        </div>

        <div className="text-center">
          <Button type="submit">Add Testimonial</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}


