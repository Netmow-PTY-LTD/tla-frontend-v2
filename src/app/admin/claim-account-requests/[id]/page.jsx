'use client';

import { useGetSingleRequestQuery } from '@/store/features/admin/generalApiService';
import {
  Building2,
  Clock,
  FileText,
  Globe,
  Hash,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

export default function SingleClaimRequestPage() {
  const { id } = useParams();

  const {
    data: singleClaimRequest,
    isLoading: isLoadingSingleRequest,
    isError,
  } = useGetSingleRequestQuery(id, {
    skip: !id,
  });

  //console.log('singleClaimRequest', singleClaimRequest);

  const {
    claimerName,
    claimerEmail,
    claimerRole,
    lawFirmName,
    lawFirmEmail,
    lawFirmPhone,
    lawFirmRegistrationNumber,
    website,
    issueDescription,
    proofOwnFiles,
    status,
    createdAt,
    country,
  } = singleClaimRequest?.data || {};

  const statusColor =
    status === 'approved'
      ? 'text-green-600 bg-green-100'
      : status === 'rejected'
      ? 'text-red-600 bg-red-100'
      : 'text-yellow-600 bg-yellow-100';

  if (isLoadingSingleRequest) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading claim request.</div>;
  }
  return (
    <div className="max-w-5xl mx-auto bg-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Claim Request Details
          </h1>
          <p className="text-gray-500 text-sm">
            Submitted on {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}
        >
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </span>
      </div>

      {/* Claimer Info */}
      <section className="mb-6 border-b border-gray-100 pb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#00C3C0]" /> Claimer Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Name" value={claimerName} />
          <InfoItem
            label="Email"
            value={claimerEmail}
            icon={<Mail className="w-4 h-4 text-gray-400" />}
          />
          <InfoItem label="Role" value={claimerRole} />
          {country?.name && <InfoItem label="Country" value={country.name} />}
        </div>
      </section>

      {/* Law Firm Info */}
      <section className="mb-6 border-b border-gray-100 pb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#00C3C0]" /> Law Firm Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Law Firm Name" value={lawFirmName} />
          <InfoItem label="Email" value={lawFirmEmail} />
          <InfoItem
            label="Phone"
            value={lawFirmPhone}
            icon={<Phone className="w-4 h-4 text-gray-400" />}
          />
          <InfoItem
            label="Registration No."
            value={lawFirmRegistrationNumber}
            icon={<Hash className="w-4 h-4 text-gray-400" />}
          />
          <InfoItem
            label="Website"
            value={website}
            icon={<Globe className="w-4 h-4 text-gray-400" />}
          />
        </div>
      </section>

      {/* Proof Files */}
      <section className="mb-6 border-b border-gray-100 pb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00C3C0]" /> Proof of Ownership
        </h2>
        {proofOwnFiles?.length ? (
          <div className="flex flex-wrap gap-4">
            {proofOwnFiles?.map((file, index) => {
              const fileName = file.split('/').pop();
              const ext = fileName?.split('.').pop()?.toLowerCase();

              const isImage = /(png|jpg|jpeg|gif|webp)$/i.test(ext);
              const isPDF = ext === 'pdf';
              const isDoc = /(doc|docx)$/i.test(ext);

              // Office viewer URL for doc/docx
              const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                file
              )}`;

              return (
                <a
                  key={index}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-40 h-48 overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition bg-white group"
                >
                  <div className="relative w-full h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img
                        src={file}
                        alt={`Proof ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    ) : isPDF ? (
                      <embed
                        src={`${file}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        className="w-full h-full"
                      />
                    ) : isDoc ? (
                      <iframe
                        src={officeViewerUrl}
                        className="w-full h-full border-0"
                        title={`Preview ${index + 1}`}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 mb-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 3h10l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                          />
                        </svg>
                        <span className="text-xs">Preview unavailable</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 text-center text-xs text-gray-700 truncate">
                    {/* {fileName?.length > 20
                      ? fileName.slice(0, 20) + '…'
                      : fileName} */}
                    <span className="block text-[#00C3C0] font-medium mt-1 group-hover:underline">
                      View File
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No files uploaded.</p>
        )}
      </section>

      {/* Issue Description */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00C3C0]" /> Issue Description
        </h2>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
          {issueDescription || 'No issue description provided.'}
        </p>
      </section>
    </div>
  );
}

function InfoItem({ label, value, icon }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium flex items-center gap-2">
        {icon}
        {value || <span className="text-gray-400">—</span>}
      </span>
    </div>
  );
}
