'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import TextInput from '@/components/form/TextInput';
import TextArea from '@/components/form/TextArea';
import { Modal } from '@/components/UIComponents/Modal';

const ServiceAddModal = () => {
  const [open, setOpen] = useState(false);
  const form = useForm();
  const onSave = () => console.log('Save clicked');
  const onCancel = () => setOpen(!open);
  return (
    <div>
      <Modal
        buttonName="+ Add Service"
        description="Describe what you can offer to customers"
        title="Adding service"
        onOpenChange={setOpen}
        open={open}
      >
        <Form {...form}>
          <div className="space-y-5">
            <TextInput
              control={form.control}
              label="Project Title"
              name="name"
              placeholder={'Service Type'}
            />
            <TextArea
              control={form.control}
              label="Service Description"
              name="description"
            />
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
      </Modal>
    </div>
  );
};

export default ServiceAddModal;
