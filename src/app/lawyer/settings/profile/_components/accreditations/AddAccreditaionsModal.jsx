import React, { useState } from 'react';
import TextInput from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';
import FileUploader from '@/components/UIComponents/fileUploader';
import { Modal } from '@/components/UIComponents/Modal';
import { CloudUpload, Edit, FileIcon, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
const AddAccreditaionsModal = () => {
  const [open, setOpen] = useState(false);
  const onSave = () => console.log('Save clicked');
  const onCancel = () => setOpen(!open);
  const form = useForm();
  return (
    <div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        buttonName={' + Add Accredition'}
        title={'Add accreditation'}
        description={'Share details of your accreditation'}
      >
        <Form {...form}>
          {/* Facebook Field */}
          <div className="space-y-5 ">
            <div>
              <TextInput
                control={form.control}
                label="Name of accreditation"
                name="accreditaion"
              />
            </div>
            <FileUploader
              label="Attach"
              onChange={(e) => console.log(e.target.files)}
              accept="image/*"
              multiple={false}
              icon={<CloudUpload className="w-6 h-6 text-[#00C3C0] mb-2" />}
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

export default AddAccreditaionsModal;
