import { Edit, FileIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const AccreditionCard = ({ accreditation, handleEditClick }) => {
  //console.log('accreditation', accreditation);
  return (
    <div className="bg-white border  rounded-sm shadow p-4 w-full  flex items-center justify-between">
      <div className="flex items-center gap-4 ">
        <div className="space-y-1">
          <h4 className=" font-semibold">
            {accreditation?.institution ?? 'Title'}
          </h4>
          <h4 className="font-medium text-[12px]">
            {accreditation?.certificate_title ?? 'Title'}
          </h4>
          {accreditation?.attachment && (
            <a
              href={accreditation?.attachment}
              target="_blank"
              rel="noopener noreferrer"
              title="View File"
              className="mt-2 inline-block"
            >
              <FileIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="p-2 rounded-md hover:bg-gray-100 transition"
          title="Edit"
          onClick={handleEditClick(accreditation)}
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
  );
};

export default AccreditionCard;
