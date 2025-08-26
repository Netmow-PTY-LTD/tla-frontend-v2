import { Modal } from '@/components/UIComponents/Modal';
import React from 'react';

export default function ReadRequestMessageModal({
  openReadMessageModal,
  setOpenReadMessageModal,
  selectedLawyerMessage,
}) {
  return (
    <Modal
      open={openReadMessageModal}
      onOpenChange={setOpenReadMessageModal}
      title="Request Message"
    >
      <h3 className="text-lg font-semibold text-black">Request Message</h3>
      <div className="p-4 bg-[#F3F3F3] rounded-lg mt-5">
        <p>{selectedLawyerMessage}</p>
      </div>
    </Modal>
  );
}
