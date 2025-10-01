import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React from 'react';
import { z } from 'zod';
import countries from '@/data/countries.json';
import SelectInput from '@/components/form/SelectInput';
import MultipleTagsSelector from '@/components/MultipleTagsSelector';
import { useAddSubscriptionMutation } from '@/store/features/admin/subcriptionsApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const subscriptionSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Title must be a string' })
    .min(1, { message: 'Title is required' }),

  price_amount: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'Price must be a number' })
      .min(1, { message: 'Price is required' })
  ),

  billingCycle: z
    .string({ invalid_type_error: 'Billing Cycle must be a string' })
    .min(1, { message: 'Billing Cycle is required' }),

  features: z.array(
    z.string({ invalid_type_error: 'Features must be an array of strings' })
  ),

  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .min(1, { message: 'Description is required' }),
});

export default function AddSubscriptionModal({
  open,
  setOpen,
  refetchSubscriptions,
}) {
  const defaultValues = {
    name: '',
    price_amount: '',
    billingCycle: '',
    features: [],
    description: '',
  };

  const [addSubscription] = useAddSubscriptionMutation();

  const handleAddSubscription = async (values) => {
    console.log('values', values);

    const { name, price_amount, billingCycle, features, description } = values;

    const payload = {
      name,
      price: { amount: Number(price_amount), currency: 'USD' },
      billingCycle,
      features,
      description,
    };

    console.log('payload', payload);

    try {
      const res = await addSubscription(payload).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Subscription added successfully');
        refetchSubscriptions();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
      showErrorToast(
        error?.data?.message || 'Failed to add subscription. Please try again.'
      );
    }
  };
  return (
    <Modal open={open} onOpenChange={setOpen} width="max-w-[700px]">
      <h3 className="text-lg font-semibold mb-6">Add Subscription</h3>
      <FormWrapper
        onSubmit={handleAddSubscription}
        defaultValues={defaultValues}
        schema={subscriptionSchema}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextInput name="name" label="Name" placeholder="subscription name" />
          {/* <TextInput name="slug" label="Slug" placeholder="slug" /> */}
          <TextInput
            name="price_amount"
            label="Price ($)"
            placeholder="price"
          />
          {/* <SelectInput
            name="currency"
            label="Currency"
            placeholder="currency"
            options={options}
          /> */}
          <div className="col-span-2">
            <SelectInput
              name="billingCycle"
              label="Billing Cycle"
              placeholder="billingCycle"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'one_time', label: 'One Time' },
              ]}
            />
          </div>
          <div className="col-span-2">
            <MultipleTagsSelector
              name="features"
              placeholder="Type and press enter to add feature"
              label="Features"
            />
          </div>
          {/* Make the last item full width using col-span-2 */}
          <div className="col-span-2">
            <TextareaInput
              name="description"
              label="Description"
              className="col-span-2"
            />
          </div>
        </div>

        <div className="text-center mt-10">
          <Button type="submit">Add Subscription</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
