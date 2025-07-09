import { useEffect, useState } from 'react';
import FileUploader from '@/components/UIComponents/fileUploader';
import FormWrapper from '@/components/form/FromWrapper';
import { Modal } from '@/components/UIComponents/Modal';
import TextInput from '@/components/form/TextInput';
import { z } from 'zod';
import { CloudUpload } from 'lucide-react';

const EditAccreditationFormModal = ({
  defaultValues,
  handleSubmit,
  open,
  onClose,
}) => {
  //const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (
      defaultValues?.attachment &&
      typeof defaultValues.attachment === 'string'
    ) {
      setPreviewUrl(defaultValues.attachment);
    }
  }, [defaultValues]);

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Edit Accreditation"
      description="Update your accreditation details"
      width={`max-w-[600px]`}
    >
      <FormWrapper
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        schema={accreditationSchema}
      >
        <div className="space-y-4">
          <TextInput
            label="Institution"
            name="institution"
            placeholder="Institution Name"
            textColor="text-[#6e6e6e]"
          />
          <TextInput
            label="Address"
            name="address"
            placeholder="Address"
            textColor="text-[#6e6e6e]"
          />
          <TextInput
            label="Certificate Title"
            name="certificate_title"
            placeholder="Certificate Title"
            textColor="text-[#6e6e6e]"
          />
          {previewUrl && (
            <div className="relative mt-2 inline-block">
              <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
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
            name="attachment"
            label="Attach File"
            onChange={handleFileChange}
            accept="*/*"
            multiple={false}
            icon={<CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />}
            width="w-full"
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
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
  );
};

export default EditAccreditationFormModal;
