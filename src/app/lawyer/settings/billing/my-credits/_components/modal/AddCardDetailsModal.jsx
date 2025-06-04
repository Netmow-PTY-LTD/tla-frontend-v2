'use client';

import React, { useState } from 'react';
import TextInput from '@/components/form/TextInput';
import { Modal } from '@/components/UIComponents/Modal';
import { CloudUpload, Edit, FileIcon, Trash } from 'lucide-react';
import FormWrapper from '@/components/form/FromWrapper';
import { z } from 'zod';

const AddAccreditationModal = ({
  defaultValues,
  handleSubmit,
  open,
  setOpen,
}) => {
  //const [open, setOpen] = useState(false);
  const onCancel = () => setOpen(!open);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const accreditationSchema = z.object({
    institution: z.string().min(1, 'Institution name is required'),
    address: z.string().min(1, 'Address is required'),
    certificate_title: z.string().min(1, 'Certificate title is required'),
    attachment: z.any().optional(), // customize this if needed
  });

  return (
    <div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={'Add Card Details'}
        width={`max-w-[600px]`}
      >
        <FormWrapper
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          schema={accreditationSchema}
        >
          <div className="space-y-5 ">
            <div>
              <TextInput
                label="Card Number"
                name="card_number"
                type="number"
                placeholder=".... .... .... ...."
              />
            </div>
            <div>
              <TextInput
                label="Address"
                name="address"
                type="text"
                placeholder="Add address"
              />
            </div>
            <div>
              <TextInput
                label="Certificate Title"
                name="certificate_title"
                placeholder="Add certificate title"
              />
            </div>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-between items-center pt-4 ">
            <button
              onClick={onCancel}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
            >
              Add Card Details
            </button>
          </div>
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default AddAccreditationModal;
