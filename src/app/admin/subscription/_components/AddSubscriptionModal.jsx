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

const subscriptionSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Title must be a string' })
    .min(1, { message: 'Title is required' }),
  slug: z
    .string({ invalid_type_error: 'Slug must be a string' })
    .min(1, { message: 'Slug is required' }),
  price: z
    .string({ invalid_type_error: 'Price must be a string' })
    .min(1, { message: 'Price is required' }),
  //   currency: z
  //     .string({ invalid_type_error: 'Currency must be a string' })
  //     .min(1, { message: 'Currency is required' }),
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

export default function AddSubscriptionModal({ open, setOpen }) {
  // Use a Set to track added currencies
  const seen = new Set();
  const options = countries
    .filter((country) => {
      const currency = country.currency.toLowerCase();
      if (seen.has(currency)) return false;
      seen.add(currency);
      return true;
    })
    .map((country) => ({
      value: country.currency.toLowerCase(), // e.g., "eur"
      label: country.currency, // e.g., "EUR"
    }));

  const defaultValues = {
    name: '',
    slug: '',
    price: '',
    currency: '',
    billingCycle: '',
    features: [],
    description: '',
  };

  const handleAddSubscription = (values) => {
    console.log('values', values);

    const { name, slug, price, billingCycle, features, description } = values;

    const payload = {
      name,
      slug,
      price,
      billingCycle,
      features,
      description,
    };

    console.log('payload', payload);
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
          <TextInput name="slug" label="Slug" placeholder="slug" />
          <TextInput name="price" label="Price ($)" placeholder="price" />
          {/* <SelectInput
            name="currency"
            label="Currency"
            placeholder="currency"
            options={options}
          /> */}
          <SelectInput
            name="billingCycle"
            label="Billing Cycle"
            placeholder="billingCycle"
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
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
