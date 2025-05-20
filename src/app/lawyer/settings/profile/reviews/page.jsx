'use client';

import TextInput from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';

import React from 'react';
import { useForm } from 'react-hook-form';

export default function Review() {
  const form = useForm();
  return (
    <div className="py-9">
      <h2 className="text-black font-semibold">Overall rating</h2>
      <p className="mt-[10px] mb-7">
        You don't have a rating because you don't have any customer reviews.For
        nearly 9 in 10 consumers, an online review is as important as a personal
        recommendation.
      </p>

      <div className="space-y-4">
        <Form {...form}>
          <div className="flex items-end gap-4">
            <div className="w-3/4">
              <TextInput
                control={form.control}
                label="Invite your customers to leave reviews"
                name="email"
                placeholder="Separate email address using commas"
              />
            </div>
            <button className="w-1/4 h-12 text-sm text-white rounded-md bg-[#12C7C4CC]">
              Invite
            </button>
          </div>
        </Form>

        <Form {...form}>
          <div className="flex items-end gap-4">
            <div className="w-3/4">
              <TextInput
                control={form.control}
                label="Share this link with your customers"
                name="customer_link"
                placeholder="https://www.bark.com/en/au/company/inleadsit/4XjReb/?show_reviews=true"
              />
            </div>
            <button className="w-1/4 h-12 text-sm text-white rounded-md bg-[#12C7C4CC]">
              Copy link
            </button>
          </div>
        </Form>

        <Form {...form}>
          <div>
            <div className="flex items-end gap-4">
              <div className="w-3/4">
                <TextInput
                  control={form.control}
                  label="Facebook reviews"
                  name="email"
                  placeholder="e.g. https://www.facebook.com/en/..."
                />
              </div>
              <button className="w-1/4 h-12 text-sm text-white rounded-md bg-[#12C7C4CC]">
                Import Reviews
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Import customer reviews from your company’s Facebook page.
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
