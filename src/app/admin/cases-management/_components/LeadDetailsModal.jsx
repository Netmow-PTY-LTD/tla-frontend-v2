'use client';

import { Modal } from '@/components/UIComponents/Modal';
import dayjs from 'dayjs';

export function LeadDetailsModal({ data, open, onOpenChange }) {
  if (!data) return null;

  return (
    <Modal
      title="Case Details"
      open={open}
      onOpenChange={onOpenChange}
      width="max-w-[600px]"
    >
      <div className="space-y-4 text-sm">
        {/* User Information */}
        <section className="border-b pb-2">
          <h3 className="font-semibold text-gray-800 mb-2">User Information</h3>
          <p>
            <strong>Name:</strong> {data.userProfileId?.name}
          </p>
          <p>
            <strong>Email:</strong> {data.userProfileId?.lawyerContactEmail}
          </p>
          <p>
            <strong>Phone:</strong> {data.userProfileId?.phone}
          </p>
          <p>
            <strong>Address:</strong> {data.userProfileId?.address}
          </p>
          <p>
            <strong>Zip Code:</strong> {data.userProfileId?.zipCode}
          </p>
          <p>
            <strong>Profile Type:</strong> {data.userProfileId?.profileType}
          </p>
        </section>

        {/* Case Information */}
        <section className="border-b pb-2">
          <h3 className="font-semibold text-gray-800 mb-2">Case Information</h3>
          <p>
            <strong>Service:</strong> {data.serviceId?.name}
          </p>
          <p>
            <strong>Budget Amount:</strong> ${data.budgetAmount}
          </p>
          <p>
            <strong>Credits Required:</strong> {data.credit}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Priority:</strong> {data.leadPriority}
          </p>
          <p>
            <strong>Additional Details:</strong>{' '}
            {data.additionalDetails || 'N/A'}
          </p>
        </section>

        {/* Metadata */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Metadata</h3>
          <p>
            <strong>Created At:</strong>{' '}
            {dayjs(data.createdAt).format('DD MMM YYYY, hh:mm A')}
          </p>
          <p>
            <strong>Updated At:</strong>{' '}
            {dayjs(data.updatedAt).format('DD MMM YYYY, hh:mm A')}
          </p>
          <p>
            <strong>Contacted:</strong> {data.isContact ? 'Yes' : 'No'}
          </p>
        </section>
      </div>
    </Modal>
  );
}
