import React, { useState } from 'react';
import TextInput from '@/components/form/TextInput';
import FileUploader from '@/components/UIComponents/fileUploader';
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
        buttonName={' + Add Accredition'}
        title={'Add accreditation'}
        description={'Share details of your accreditation'}
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
                label="Name of Institution"
                name="institution"
                placeholder="Add institution name"
                textColor="text-[#8E8E8E]"
              />
            </div>
            <div>
              <TextInput
                label="Address"
                name="address"
                placeholder="Add address"
                textColor="text-[#8E8E8E]"
              />
            </div>
            <div>
              <TextInput
                label="Certificate Title"
                name="certificate_title"
                placeholder="Add certificate title"
                textColor="text-[#8E8E8E]"
              />
            </div>
            {previewUrl && (
              <div className="relative mt-2 inline-block">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Preview:
                </p>
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-[80px] rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-1 right-1 bg-white border border-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <FileUploader
              label="Attach File"
              name="attachment"
              onChange={handleFileChange}
              accept="image/*"
              multiple={false}
              icon={<CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />}
              width="w-full"
            />
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
              Save
            </button>
          </div>
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default AddAccreditationModal;
