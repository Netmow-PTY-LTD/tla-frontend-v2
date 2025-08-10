import { Modal } from '@/components/UIComponents/Modal';
import dayjs from 'dayjs';

export function UserDetailsModal({ data, open, onOpenChange }) {
  if (!data) return null;

  const profile = data?.profile || {};
  return (
    <Modal
      title="Case Details"
      open={open}
      onOpenChange={onOpenChange}
      width="max-w-[600px]"
    >
      <div className="space-y-4 text-sm">
        {/* User Account Info */}
        <section className="border-b pb-2">
          <h3 className="font-semibold text-gray-800 mb-2">
            Account Information
          </h3>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Phone Verified:</strong> {data.isPhoneVerified}
          </p>
          <p>
            <strong>Account Status:</strong> {data.accountStatus}
          </p>
          <p>
            <strong>Verified Account:</strong>{' '}
            {data.isVerifiedAccount ? 'Yes' : 'No'}
          </p>
          {/* <p><strong>Online Status:</strong> {data.isOnline ? 'Online' : 'Offline'}</p>
          <p><strong>Last Seen:</strong> {dayjs(data.lastSeen).format('DD MMM YYYY, hh:mm A')}</p> */}
        </section>

        {/* Profile Info */}
        <section className="border-b pb-2">
          <h3 className="font-semibold text-gray-800 mb-2">
            Profile Information
          </h3>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
          <p>
            <strong>Zip Code:</strong> {profile.zipCode}
          </p>
          <p>
            <strong>Gender:</strong> {profile.gender || 'N/A'}
          </p>
          <p>
            <strong>Designation:</strong> {profile.designation || 'N/A'}
          </p>
          <p>
            <strong>Profile Type:</strong> {profile.profileType}
          </p>
          <p>
            <strong>Credits:</strong> {profile.credits}
          </p>
          <p>
            <strong>Lawyer Email:</strong> {profile.lawyerContactEmail}
          </p>
          <p>
            <strong>Law Society #:</strong>{' '}
            {profile.law_society_member_number || 'N/A'}
          </p>
          <p>
            <strong>Practising Certificate #:</strong>{' '}
            {profile.practising_certificate_number || 'N/A'}
          </p>
        </section>

        {/* Metadata */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-2">Joining Data</h3>
          <p>
            <strong>Open Account:</strong>{' '}
            {dayjs(data.createdAt).format('DD MMM YYYY, hh:mm A')}
          </p>
        </section>
      </div>
    </Modal>
  );
}
