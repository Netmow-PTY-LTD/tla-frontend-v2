'use client';

import React, { Suspense, useState } from 'react';

import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import {
  useAddPaymentMethodMutation,
  useGetAllCreditPackagesQuery,
  useGetPaymentMethodQuery,
  usePurchaseCreditPackageMutation,
  useSpendCreditMutation,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { Modal } from '@/components/UIComponents/Modal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Loader } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CreditPurchaseForLead from './CreditPurchaseForLead';
import AddCardModal from '@/app/lawyer/settings/credit-payment/_components/modal/AddCardModal';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const LawyerContactModal = ({ leadDetail }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log('lead details ==>', leadDetail);

  const {
    data: packageData,
    isError: packageIsError,
    isLoading: packageIsLoading,
  } = useGetAllCreditPackagesQuery();

  const [spendCredit, { isLoading }] = useSpendCreditMutation();
  const { data: userinfo } = useAuthUserInfoQuery();

  const userCredit = userinfo?.data?.profile?.credits || 0;

  const handleContactClick = () => {
    if (!userCredit > 0) {
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

  const [autoTopUP, setAutoTopUp] = useState(false);
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const [purchasePackage] = usePurchaseCreditPackageMutation();
  const {
    data,
    isError,
    isLoading: isLoadingPaymentMethod,
  } = useGetPaymentMethodQuery();

  const card = data?.data || null;

  const handleCardAdded = async (paymentMethodId) => {
    const result = await addPaymentMethod({ paymentMethodId }).unwrap();
    if (result.success) {
      showSuccessToast(result?.message);
    } else {
      showErrorToast(result?.message);
    }
    try {
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };
  const handlePurchase = async (creditPackageId, creditPrice) => {
    const purchaseDetails = {
      packageId: creditPackageId,
      autoTopUP,
      couponCode: null,
    };
    try {
      const result = await purchasePackage(purchaseDetails).unwrap();
      console.log('Purchase result:', result);
      if (result.success) {
        showSuccessToast(result?.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
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
      <Modal open={openPayment} onOpenChange={setOpenPayment} width="max-10xl">
        <div>
          {packageIsLoading ? (
            <div className=" text-sm flex justify-center items-center ">
              <Loader /> Loading...
            </div>
          ) : packageIsError ? (
            <div className="text-red-500 text-sm">
              Failed to load credit packages. Please try again.
            </div>
          ) : packageData?.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {packageData?.data?.slice(0, 1).map((creditPackage) => (
                <CreditPurchaseForLead
                  key={creditPackage?._id}
                  creditPackage={creditPackage}
                  setIsOpen={setIsOpen}
                  isOpen={isOpen}
                  setOpen={setOpen}
                  open={open}
                  autoTopUP={autoTopUP}
                  setAutoTopUp={setAutoTopUp}
                  card={card}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 bg-gray-50 rounded-lg shadow-sm p-5">
              We don't have any credit packages available at the moment.
              <br />
              <span className="text-[#00C3C0] hover:underline cursor-pointer inline-block mt-2">
                Please check back later.
              </span>
            </div>
          )}
        </div>
      </Modal>
      <Elements stripe={stripePromise}>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-10">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-gray-500">
                <Loader /> Loading...
              </span>
            </div>
          }
        >
          <AddCardModal
            open={open}
            setOpen={setOpen}
            onCardAdded={handleCardAdded}
          />
        </Suspense>
      </Elements>

      <ConfirmationModal
        onConfirm={() =>
          handlePurchase(creditPackage?._id, creditPackage?.price)
        }
        open={isOpen}
        onOpenChange={setIsOpen}
        description="Are you sure you want to purchase this credit package?"
      />
    </div>
  );
};

export default LawyerContactModal;
