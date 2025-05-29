'use client';

import TextareaInput from '@/components/form/TextArea';
import TextInput from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';
import ToggleSwitch from '@/components/UIComponents/ToggleSwitch';
import { CircleAlert } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function SocialMediaLink() {
  const form = useForm();
  const handleToggle = (checked) => {
    console.log('Switch is now:', checked);
  };
  return (
    <div>
      <h2 className="16px text-black font-semibold">Social media</h2>
      <p className="text-[#8E8E8E] mt-[10px]">
        Add your company social media accounts to lend credibility to your
        business - it is often something customers will look for to validate
        their hiring decisions.
      </p>

      <Form {...form}>
        {/* Facebook Field */}
        <div className="flex items-center justify-between gap-4 mt-3">
          <div className="w-2/4">
            <TextInput
              control={form.control}
              label="Facebook"
              name="facebook"
              placeholder="https://facebook.com/"
            />
          </div>
          <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
            <CircleAlert className="w-4 h-4" />
            <span>Optional</span>
            <ToggleSwitch onToggle={handleToggle} />
          </div>
        </div>

        {/* Twitter Field */}
        <div className="flex items-center justify-between gap-4 mt-3">
          <div className="w-2/4">
            <TextInput
              control={form.control}
              label="Twitter"
              name="twitter"
              placeholder="username"
            />
          </div>
          <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
            <CircleAlert className="w-4 h-4" />
            <span>Optional</span>
            <ToggleSwitch onToggle={handleToggle} />
          </div>
        </div>

        {/* Links Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-base font-semibold text-black">Links</h2>
              <p className="text-sm text-[#8E8E8E] mt-2">
                Link to your own website, articles about your business, or any
                other content that will help promote your business.
              </p>
            </div>
            <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
              <CircleAlert className="w-4 h-4" />
              <span>Optional</span>
              <ToggleSwitch onToggle={handleToggle} />
            </div>
          </div>

          <div className="mt-5">
            <TextareaInput
              label="Describe your company"
              name="link"
              placeholder="Enter one link per line"
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
