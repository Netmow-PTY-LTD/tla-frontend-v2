'use client';

import React, { useState } from 'react';

import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useSpendCreditMutation } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { Modal } from '@/components/UIComponents/Modal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const LawyerContactModal = ({ leadDetail }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  console.log('lead details ==>', leadDetail);

  const [spendCredit, { isLoading }] = useSpendCreditMutation();
  const { data: userinfo } = useAuthUserInfoQuery();

  const userCredit = userinfo?.data?.profile?.credits || 0;

  const handleContactClick = () => {
    if (userCredit > 0) {
      setOpenConfirm(true); // Show confirmation modal
    } else {
      setOpenPayment(true); // Show payment modal
    }
  };

  const handleSpendCredit = async () => {
    try {
      const payload = {
        credit: leadDetail?.credit,
        description: `Contacted lead ${leadDetail?._id}`,
        relatedLeadId: leadDetail?._id,
      };

      const result = await spendCredit(payload).unwrap();

      if (result.success) {
        showSuccessToast(result?.message);
      }
      setOpenConfirm(false);
      // Optionally, show toast/success UI here
    } catch (error) {
      console.error('Credit spending failed:', error);
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      // Optionally, show error toast
    }
  };

  return (
    <div>
      <button onClick={handleContactClick} className="btn-default bg-[#00C3C0]">
        Contact {leadDetail?.userProfileId?.name ?? ''}
      </button>

      {/* Confirm Modal for spending credit */}
      <ConfirmationModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        onConfirm={handleSpendCredit}
        isLoading={isLoading}
        title={`Spend ${leadDetail?.credit} credit to contact this lead?`}
        description="This action will deduct credits from your account. Once confirmed, you will gain access to this lead's contact information."
        confirmText="Yes, spend credit"
        cancelText="Cancel"
        contentClass={'max-w-xl max-h-xl'}
      />

      {/* Payment Modal if no credits */}
      <Modal open={openPayment} onOpenChange={setOpenPayment}>
        <h2>Test</h2>
      </Modal>
    </div>
  );
};

export default LawyerContactModal;
