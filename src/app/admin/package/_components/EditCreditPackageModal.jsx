import { Modal } from '@/components/UIComponents/Modal';
import React from 'react';

export default function EditCreditPackageModal({ open, onClose }) {
  return (
    <Modal open={open} onOpenChange={onClose} title="Edit Credit Package">
      <h1>Credit Package</h1>
    </Modal>
  );
}
