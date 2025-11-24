import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import countries from '@/data/countries.json';
import SelectInput from '@/components/form/SelectInput';
import MultipleTagsSelector from '@/components/MultipleTagsSelector';
import {
  useGetEliteProSubscriptionByIdQuery,
  useUpdateEliteProSubscriptionMutation,
} from '@/store/features/admin/eliteProSubscriptionsApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const eliteProSubscriptionSchema = z.object({
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

export default function EditEliteProSubscriptionModal({
  open,
  setOpen,
  subscriptionId,
  refetchEliteProSubscriptions,
}) {
  const [defaultValues, setDefaultValues] = useState({
    name: '',
    price_amount: '',
    billingCycle: '',
    features: [],
    description: '',
  });

  const { data: subscriptionData } = useGetEliteProSubscriptionByIdQuery(
    subscriptionId,
    {
      skip: !subscriptionId,
    }
  );

  const subscription = subscriptionData?.data;

  console.log('subscription', subscription);

  useEffect(() => {
    if (subscription) {
      setDefaultValues({
        name: subscription?.name,
        price_amount: subscription?.price?.amount,
        billingCycle: subscription?.billingCycle,
        features: subscription?.features,
        description: subscription?.description,
      });
    }
  }, [subscription]);

  const [updateEliteProSubscription] = useUpdateEliteProSubscriptionMutation();
  const handleEditEliteProSubscription = async (values) => {
    const { name, price_amount, billingCycle, features, description } = values;

    const payload = {
      name,
      price: { amount: Number(price_amount), currency: 'USD' },
      billingCycle,
      features,
      description,
    };

    // console.log('payload', payload);

    try {
      const res = await updateEliteProSubscription({
        subscriptionId,
        body: payload,
      }).unwrap();
      // console.log('res', res);
      if (res?.success) {
        showSuccessToast(
          res?.message || 'Elite Pro Subscription updated successfully'
        );
        refetchEliteProSubscriptions();
        setOpen(false);
      }
    } catch (error) {
      console.error('Error updating Elite Pro Subscription:', error);
      showErrorToast(
        error?.data?.message ||
          'Failed to update Elite Pro Subscription. Please try again.'
      );
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen} width="max-w-[700px]">
      <h3 className="text-lg font-semibold mb-6">
        Edit Elite Pro Subscription
      </h3>
      <FormWrapper
        onSubmit={handleEditEliteProSubscription}
        defaultValues={defaultValues}
        schema={eliteProSubscriptionSchema}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextInput name="name" label="Name" placeholder="subscription name" />
          <TextInput
            name="price_amount"
            label="Price ($)"
            placeholder="price"
          />

          <div className="col-span-2">
            <SelectInput
              name="billingCycle"
              label="Billing Cycle"
              placeholder="Select a billing cycle"
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
          <Button type="submit">Update Elite Pro Subscription</Button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
