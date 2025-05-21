'use client';

import { Modal } from '@/components/UIComponents/Modal';
import { Edit, FileIcon, Trash } from 'lucide-react';

export default function AccreditionsList() {
  return (
    <div className="mt-5">
      <div className="bg-[#f3f3f3] border  rounded-sm shadow p-4 w-full  flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <h1 className=" font-semibold">Title</h1>
          <span>
            <FileIcon className="w-4 h-4" />
          </span>
        </div>

        <div className="flex justify-end gap-3 ">
          <button
            type="button"
            className="p-2 rounded-md hover:bg-gray-100 transition"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 rounded-md hover:bg-gray-100 transition"
            title="Trust"
          >
            <Trash className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <Modal buttonName={' + Add Accredition'}>
        <h2>Test modal</h2>
      </Modal>
    </div>
  );
}
