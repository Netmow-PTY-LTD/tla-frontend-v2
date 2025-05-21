'use client';

import TextArea from '@/components/form/TextArea';
import { Form } from '@/components/ui/form';
import ToggleSwitch from '@/components/UIComponents/ToggleSwitch';
import { CircleAlert } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function QuestionsAndAnswers() {
  const form = useForm();
  const handleToggle = (checked) => {
    console.log('Switch is now:', checked);
  };

  const onSave = () => console.log('Save clicked');
  const onCancel = () => console.log('Cancel clicked');
  return (
    <div className="max-w-[900px]">
      <Form {...form}>
        {/* Links Section */}
        <div>
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-base font-semibold text-black">Links</h2>
              <p className="text-sm text-[#8E8E8E] mt-2">
                Answer common questions to remove customer, reservations and
                doubt, bring them closer to making them hiring decision.
              </p>
            </div>
            <div className="flex items-center gap-2 max-w-sm p-2 rounded-md text-gray-700 text-sm">
              <CircleAlert className="w-4 h-4" />
              <span>Optional</span>
              <ToggleSwitch onToggle={handleToggle} />
            </div>
          </div>

          <div className="space-y-5 mt-5">
            <div>
              <TextArea
                control={form.control}
                label="What do you love most about your job ?"
                name="item"
              />
              <p className="mt-2">Minimum 50 Character</p>
            </div>
            <div>
              <TextArea
                control={form.control}
                label="What inspired you to start your own business ?"
                name="item"
              />
              <p className="mt-2">Minimum 50 Character</p>
            </div>
            <div>
              <TextArea
                control={form.control}
                label="Why should our clients choose you ?"
                name="item"
              />
              <p className="mt-2">Minimum 50 Character</p>
            </div>
            <div>
              <TextArea
                control={form.control}
                label="Can you provide your services online or remotely ?"
                name="item"
              />
              <p className="mt-2">Minimum 50 Character</p>
            </div>
          </div>
        </div>
      </Form>
      {/* Footer Buttons */}
      <div className="flex justify-between items-center pt-4 ">
        <button
          onClick={onCancel}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
        >
          Save
        </button>
      </div>
    </div>
  );
}
