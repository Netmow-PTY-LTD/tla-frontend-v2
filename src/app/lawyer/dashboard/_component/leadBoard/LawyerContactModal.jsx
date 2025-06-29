'use client';

import { Modal } from '@/components/UIComponents/Modal';
import React, { useState } from 'react';

const LawyerContactModal = ({ leadDetail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="btn-default bg-[#00C3C0]"
      >
        Contact {leadDetail?.userProfileId?.name ?? ''}
      </button>
      <Modal open={open} onOpenChange={setOpen}></Modal>
    </div>
  );
};

export default LawyerContactModal;
