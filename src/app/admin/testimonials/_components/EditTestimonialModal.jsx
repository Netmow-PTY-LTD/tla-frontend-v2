import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useGetSingleTestimonialQuery, useUpdateTestimonialMutation } from '@/store/features/testimonials/testimonialsService';
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

export default function EditTestimonialModal({
  open,
  setOpen,
  testimonialId,
  refetchTestimonialData,
}) {
  const [defaultValues, setDefaultValues] = useState({
    name: '',
    comment: '',
    image: null,
  });

  const formRef = useRef(null);

  // When modal closes, reset form
  useEffect(() => {
    if (open && testimonialId) {
      formRef.current?.reset(defaultValues);
    }
  }, [open, testimonialId, defaultValues]);

  const { data: testimonialData } = useGetSingleTestimonialQuery(testimonialId, {
    skip: !testimonialId,
  });

  const testimonial = testimonialData?.data;

 

  useEffect(() => {
    if (testimonial) {
      const dv = {
        name: testimonial.name ?? '',
        comment: testimonial.comment ?? '',
        image: testimonial.image ?? null,
      };
      setDefaultValues(dv);

      // If modal is already open, immediately reset the form to the new values
      // (formRef.current.reset refers to the imperative method we exposed in FormWrapper)
      if (open && formRef.current?.reset) {
        formRef.current.reset(dv);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonial, open]);

  useEffect(() => {
    if (open) {
      // if testimonial already loaded, reset to testimonial-derived defaults
      if (testimonial) {
        formRef.current?.reset({
          name: testimonial.name ?? '',
          comment: testimonial.comment ?? '',
          image: testimonial.image ?? null,
        });
      } else {
        // testimonial not loaded yet (still fetching) -> clear or keep previous values as you prefer
        // I recommend clearing to avoid stale UI while fetching:
        formRef.current?.reset({
          name: '',
          comment: '',
          image: null,
        });
      }
    }
  }, [open, testimonial]);

  const [updateTestimonial, { isLoading: isUpdateTestimonialLoading }] =
    useUpdateTestimonialMutation();

  const handleUpdateTestimonial = async (values) => {
    const { name, comment, image } = values;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('comment', comment);

    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      const res = await updateTestimonial({ id: testimonial.id, data: formData }).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'Testimonial updated successfully');
        refetchTestimonialData();
        setOpen(false);
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to update testimonial');
    }
  };
  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setDefaultValues({
          name: '',
          comment: '',
          image: null,
        });
      }}
    >
      <h3 className="text-lg font-semibold mb-6">Edit Testimonial</h3>
      <FormWrapper
        key={testimonialId} // Reset form when testimonialId changes
        onSubmit={handleUpdateTestimonial}
        defaultValues={defaultValues}
        schema={testimonialSchema}
        formRef={formRef}
        ref={formRef}
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

        <div className="text-center mt-10">
          <Button type="submit" disabled={isUpdateTestimonialLoading}>
            {isUpdateTestimonialLoading ? 'Updating...' : 'Update Testimonial'}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
