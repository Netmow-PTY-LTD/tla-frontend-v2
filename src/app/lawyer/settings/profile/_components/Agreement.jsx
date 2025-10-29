'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import {
  useAuthUserInfoQuery,
  useUpdateUserDataMutation,
} from '@/store/features/auth/authApiService';
import { ArrowDownToLine, Eye, File, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Agreement() {
  const [fileName, setFileName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuthUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true, // keep data fresh
  });

  const savedAgreement = userInfo?.data?.profile?.agreement;

  //console.log('savedAgreement', savedAgreement);

  const [updateUserData, { isLoading: experienceIsLoading }] =
    useUpdateUserDataMutation();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    const allowedTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    if (!allowedTypes.includes(file.type)) {
      showErrorToast('Only PDF or Word documents are allowed.');
      return;
    }

    setFileName(file.name);
    setFileUrl(URL.createObjectURL(file));
    setFileType(file.type);
    e.target.value = ''; // Reset input

    const formData = new FormData();
    formData.append('agreementfiles', file);

    try {
      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'Agreement updated successfully');
        refetch();
      }
      console.log('Update response:', res);
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      console.error('Error submitting form:', error);
    }
  };

  const handleRemove = async () => {
    try {
      // Clear local state
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      setFileName(null);
      setFileUrl(null);
      setFileType(null);

      const formData = new FormData();
      formData.append('agreementfiles', ''); // Send empty string to clear

      const res = await updateUserData(formData).unwrap();
      if (res?.success === true) {
        showSuccessToast(res?.message || 'File removed successfully');
        refetch();
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'Error removing file';
      showErrorToast(errorMessage);
      console.error('Error removing file:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-[900px] mx-auto">
      <h3 className="heading-lg font-semibold text-black">
        Legal services agreement
      </h3>
      <p className="text-sm text-[#8E8E8E] mt-2">
        please upload your LSA or download our example document here
      </p>
      <div className="flex flex-wrap justify-between items-center gap-4 mt-5">
        <div className="flex gap-2">
          <File className="w-4 h-4" />
          <span>Legal Services Agreement Template</span>
        </div>
        <a
          href="/lawyer/settings/profile/_components/agreement/Legal_Services_Agreement_Template_TLA.docx"
          className="flex items-center gap-2 py-2 px-6 bg-[var(--secondary-color)] rounded text-white"
          download={true}
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Download</span>
        </a>
      </div>

      <div className="mt-8 space-y-4">
        {/* Upload Box - hidden if file is uploaded */}
        {!savedAgreement?.agreement && (
          <div>
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded cursor-pointer hover:border-[#00C3C0] transition duration-200"
            >
              <ArrowDownToLine className="w-6 h-6 text-gray-500 mb-2" />
              <span className="text-gray-700">Click to upload PDF</span>
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Uploaded file info */}
        {savedAgreement?.agreement && (
          <div className="flex flex-col gap-2 border border-gray-200 rounded px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium truncate">
                {savedAgreement?.agreement}
              </span>
              <div className="flex gap-3 items-center">
                <a
                  href={savedAgreement?.agreement}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </a>
                <button
                  onClick={handleRemove}
                  className="flex items-center gap-1 text-red-600 hover:underline text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
