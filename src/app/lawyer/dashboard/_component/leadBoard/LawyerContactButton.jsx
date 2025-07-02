'use client';

import React, { useState, Suspense } from 'react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Loader } from 'lucide-react';
import { Modal } from '@/components/UIComponents/Modal';
import { useContactLawyerMutation } from '@/store/features/lawyer/LeadsApiService';
import CreditPurchaseLead from './CreditPurchaseLead';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const LawyerContactButton = ({ leadDetail }) => {
  const [packageData, setPackageData] = useState('')
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [needAddCard, setNeedAddCard] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [contactLawyer] = useContactLawyerMutation();

  const router = useRouter()
  const handleContact = async () => {
    const payload = {
      leadId: leadDetail?._id,
      serviceId: leadDetail?.serviceId?._id,
      credit: leadDetail?.credit,
    };
    try {
      const res = await contactLawyer(payload).unwrap();
      console.log('response ==>', res)
      if (res.success) {
        console.log('response ==>', res)
        toast.success('Contacted successfully');
        setTimeout(() => {
          router.push(`/lawyer/dashboard/my-responses?responseId=${res?.data?.responseId}`);
        }, 500);

      } else if (res?.data?.autoPurchaseCredit || res?.data?.needAddCard) {
        setPackageData(res?.data?.recommendedPackage)
        setPendingPayload(payload);
        setShowCreditModal(true);
        setNeedAddCard(res?.data?.needAddCard ? res?.data?.needAddCard : false)
      } else {
        toast.error(res.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong while contacting the lawyer');
    }
  };

  const handleAfterPayment = async () => {
    setShowCreditModal(false);
    if (pendingPayload) {
      try {
        const retryRes = await contactLawyer(pendingPayload).unwrap();
        if (retryRes.success) {
          toast.success('Contacted successfully after payment');
          setTimeout(() => {
            router.push(`/lawyer/dashboard/my-responses?responseId=${retryRes?.data?.responseId}`);
            console.log('response id ==>', retryRes?.data?.responseId)
          }, 500);
        } else {
          toast.error(retryRes.message || 'Retry failed');
        }
      } catch (err) {
        toast.error(err?.data?.message || 'Retry failed');
      }
      setPendingPayload(null);
    }
  };

  return (
    <div>
      <button onClick={handleContact} className="btn-default bg-[#00C3C0]">
        Contact {leadDetail?.userProfileId?.name ?? ''}
      </button>

      {showCreditModal && (
        <Elements stripe={stripePromise}>
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-10">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-sm text-gray-500">
                  <Loader className="w-4 h-4 animate-spin" /> Loading...
                </span>
              </div>
            }
          >
            <Modal open={showCreditModal} onOpenChange={setShowCreditModal} width="max-w-screen-md">
              <div>
                <CreditPurchaseLead
                  onSuccess={handleAfterPayment}
                  onClose={() => setShowCreditModal(false)}
                  recommendedPackage={packageData}
                  needAddCard={needAddCard}

                />
              </div>
            </Modal>
          </Suspense>
        </Elements>
      )}
    </div>
  );
};

export default LawyerContactButton;
