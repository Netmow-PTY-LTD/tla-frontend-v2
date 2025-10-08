import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import countries from '@/data/countries.json';
import SelectInput from '@/components/form/SelectInput';
import AvatarUploader from '@/components/UIComponents/AvaterUploader';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useGetSingleTestimonialQuery, useUpdateTestimonialMutation } from '@/store/features/testimonials/testimonialsService';

const testimonialSchema = z.object({
  country: z.string({ invalid_type_error: 'Country is required' }),
  testimonialName: z
    .string({ invalid_type_error: 'Testimonial Name is required' })
    .min(1, { message: 'Testimonial Name is required' }),
  type: z.string({ invalid_type_error: 'Type is required' }),
  photo: z.any().optional(),
});

export default function EditTestimonialModal({
  open,
  setOpen,
  testimonialId,
  refetchTestimonialData,
}) {
  const [defaultValues, setDefaultValues] = useState({
    country: '',
    testimonialName: '',
    type: '',
    photo: null,
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

  //console.log('testimonial', testimonial);

  // useEffect(() => {
  //   if (testimonial) {
  //     setDefaultValues({
  //       country: testimonial.countryId,
  //       testimonialName: testimonial.testimonialName,
  //       type: testimonial.type,
  //       photo: testimonial.photo || null,
  //     });
  //   }
  // }, [testimonial]);

  useEffect(() => {
    if (testimonial) {
      const dv = {
        country: testimonial.countryId ?? '',
        testimonialName: testimonial.testimonialName ?? '',
        type: testimonial.type ?? '',
        photo: testimonial.photo ?? null,
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
          country: testimonial.countryId ?? '',
          testimonialName: testimonial.testimonialName ?? '',
          type: testimonial.type ?? '',
          photo: testimonial.photo ?? null,
        });
      } else {
        // testimonial not loaded yet (still fetching) -> clear or keep previous values as you prefer
        // I recommend clearing to avoid stale UI while fetching:
        formRef.current?.reset({
          country: '',
          testimonialName: '',
          type: '',
          photo: null,
        });
      }
    }
  }, [open, testimonial]);

  const [updateTestimonial, { isLoading: isUpdateTestimonialLoading }] =
    useUpdateTestimonialMutation();

  const handleUpdateTestimonial = async (values) => {
    const { country, testimonialName, type, photo } = values;

    const payload = {
      country,
      testimonialName,
      type,
    };

    console.log('payload', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    if (photo instanceof File) {
      formData.append('photo', photo);
    }

    try {
      const res = await updateTestimonial({
        testimonialId,
        body: formData,
      }).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Testimonial updated successfully');
        refetchTestimonialData();
        setOpen(false);
      }
      setOpen(false);
    } catch (error) {
      console.log('error', error);
      showErrorToast(error?.data?.message || 'Failed to update testimonial');
    }
  };
  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setDefaultValues({
          country: '',
          testimonialName: '',
          type: '',
          photo: null,
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
          <SelectInput
            name="country"
            label="Country"
            placeholder="select a country"
            options={countries.map((country) => ({
              value: country.countryId,
              label: country.name,
            }))}
            disabled
          />
          <TextInput
            name="testimonialName"
            label="Name"
            placeholder="testimonial name"
          />
          <SelectInput
            name="type"
            label="Type"
            placeholder="select a type"
            options={[
              { value: 'positive', label: 'Positive' },
              { value: 'negative', label: 'Negative' },
            ]}
          />
          <div className="flex flex-col gap-3">
            <label htmlFor="photo" className="label-text">
              Upload Photo
            </label>
            <AvatarUploader name="photo" />
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
