'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import { BrandIcon } from '@/assets/icon';
import {
  useAddPaymentMethodMutation,
  useCancelSubscriptionMutation,
  useCreateSubscriptionMutation,
  useGetPaymentMethodQuery,
  usePurchaseCreditPackageMutation,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import AddCardModal from '../modal/AddCardModal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { Loader } from 'lucide-react';

const EliteProSubscriptionPurchase = ({ subscriptionPlan, currentSubscription = null, onChangeSubscription = null, changeLoading = false }) => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [changeConfirmOpen, setChangeConfirmOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const [subscriptionSubscription, { isLoading: subscribeLoading }] =
    useCreateSubscriptionMutation();
  const [cancelSubscription, { isLoading: cancelSubscriptionLoading }] =
    useCancelSubscriptionMutation();
  const { data: userInfo } = useAuthUserInfoQuery();

  const { data, isError, isLoading } = useGetPaymentMethodQuery();

  const card = data?.data || null;

  const activeSubscription =
    userInfo?.data?.profile?.eliteProSubscriptionId || null;

  const isSubscribedToThisPlan =
    activeSubscription &&
    activeSubscription.eliteProPackageId?._id === subscriptionPlan?._id &&
    activeSubscription.status === 'active';

  // Determine if this is an upgrade, downgrade, or current plan
  const getSubscriptionAction = () => {
    if (!currentSubscription || !currentSubscription.eliteProPackageId) {
      return 'subscribe'; // No current subscription
    }

    if (isSubscribedToThisPlan) {
      return 'current'; // This is the current plan
    }

    const currentPrice = currentSubscription.eliteProPackageId?.price?.amount || 0;
    const planPrice = subscriptionPlan?.price?.amount || 0;

    if (planPrice > currentPrice) {
      return 'upgrade';
    } else if (planPrice < currentPrice) {
      return 'downgrade';
    } else {
      return 'change'; // Same price, different plan
    }
  };

  const subscriptionAction = getSubscriptionAction();

  const handleCardAdded = async (paymentMethodId) => {
    const result = await addPaymentMethod({ paymentMethodId }).unwrap();
    if (result.success) {
      showSuccessToast(result?.message);
      handleEliteProSubscription({ subscriptionPackageId: subscriptionPlan?._id });
    } else {
      showErrorToast(result?.message);
    }
    try {
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  const handleEliteProSubscription = async ({ subscriptionPackageId }) => {
    const subscriptionDetails = {
      packageId: subscriptionPackageId,
      autoRenew,
      type: 'elitePro',
    };

    // console.log('Subscription Details:', subscriptionDetails);

    try {
      const result = await subscriptionSubscription(
        subscriptionDetails
      ).unwrap();
      // console.log('Subscription result:', result);
      if (result.success) {
        showSuccessToast(result?.message);
      } else {
        showErrorToast(result?.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  //  Cancel subscription handler
  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription({ type: 'elitePro' }).unwrap();
      if (result.success) {
        showSuccessToast(
          result?.message || 'Subscription cancelled successfully'
        );
      } else {
        showErrorToast(result?.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  // Handle change subscription (upgrade/downgrade)
  const handleChangeSubscription = async () => {
    setChangeConfirmOpen(true);
  };

  const confirmChangeSubscription = async () => {
    setChangeConfirmOpen(false);
    if (onChangeSubscription) {
      await onChangeSubscription(subscriptionPlan?._id);
    }
  };

  return (
    <div>
      <div className="border-0 bg-white rounded-lg p-6 relative">
        {subscriptionPlan.discountPercentage > 0 && (
          <div className="bg-[#00C3C0] absolute text-white p-[10px] rounded-tl-md rounded-br-md text-sm font-medium top-0 left-0">
            <h2 className="text-sm font-medium text-white whitespace-nowrap">
              {subscriptionPlan.discountPercentage}% OFF Elite Pro Plan
            </h2>
          </div>
        )}

        <div
          className={`${subscriptionPlan.discountPercentage > 0 ? 'mt-12' : ''
            }`}
        >
          <div className="grid md:grid-cols-4 gap-6 items-start">
            <div className="flex flex-col space-y-2">
              <p className="font-medium text-gray-900 text-lg">
                {subscriptionPlan?.name}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <BrandIcon />
              <p className="font-medium text-gray-900 capitalize">
                {subscriptionPlan?.billingCycle}
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <p className="font-semibold text-gray-900 text-lg">
                  {subscriptionPlan?.priceFormatted}
                </p>
                {subscriptionPlan?.taxAmount > 0 && (
                  <p className="text-gray-500 text-xs font-normal">
                    (Inc. {subscriptionPlan?.taxAmount} {subscriptionPlan?.taxType || 'GST'})
                  </p>
                )}
                {!subscriptionPlan?.taxAmount && (
                  <p className="text-gray-500 text-xs font-normal">
                    (Inc. {subscriptionPlan?.taxType || 'GST'})
                  </p>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {subscriptionPlan?.price?.currency}{' '}
                {subscriptionPlan?.price?.amount}/month (Ex. {subscriptionPlan?.taxType || 'GST'})
              </p>
            </div>

            <div>
              {subscriptionAction === 'current' ? (
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 flex items-center justify-center"
                  onClick={() => setCancelOpen(true)}
                  disabled={cancelSubscriptionLoading}
                >
                  {cancelSubscriptionLoading ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              ) : subscriptionAction === 'upgrade' ? (
                <Button
                  variant="primary"
                  className="bg-[#12C7C4CC] hover:bg-teal-600 text-white px-4 flex items-center justify-center"
                  onClick={handleChangeSubscription}
                  disabled={changeLoading}
                >
                  {changeLoading ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Upgrading...
                    </>
                  ) : (
                    'Upgrade Plan'
                  )}
                </Button>
              ) : subscriptionAction === 'downgrade' ? (
                <Button
                  variant="secondary"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 flex items-center justify-center"
                  onClick={handleChangeSubscription}
                  disabled={changeLoading}
                >
                  {changeLoading ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Downgrading...
                    </>
                  ) : (
                    'Downgrade Plan'
                  )}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="bg-[#12C7C4CC] hover:bg-teal-600 text-white px-4 flex items-center justify-center"
                  onClick={() => {
                    if (!card) setOpen(true);
                    else setIsOpen(true);
                  }}
                  disabled={subscribeLoading}
                >
                  {subscribeLoading ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-gray-900 font-medium text-md mb-2 text-base">
              Elite Pro Features:
            </h3>
            <ul className="list-disc list-inside text-gray-700 text-sm">
              {subscriptionPlan?.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-5 p-3 bg-[#f9f9fa] rounded-md">
              {subscriptionPlan?.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="w-full">
              <div className="flex items-center space-x-2 bg-[#f9f9fa] rounded-full">
                <Image
                  src="/assets/img/Credits/guarantee.png"
                  alt="Guarantee"
                  width={80}
                  height={80}
                />
                <p className="text-sm text-gray-700">
                  Unlock premium benefits and uninterrupted access with Elite
                  Pro subscription plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCardModal
        open={open}
        setOpen={setOpen}
        onCardAdded={handleCardAdded}
      />
      <ConfirmationModal
        onConfirm={() =>
          handleEliteProSubscription({
            subscriptionPackageId: subscriptionPlan?._id,
          })
        }
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Confirm Elite Pro Subscription"
        description={`Are you sure you want to subscribe to the Elite Pro ${subscriptionPlan?.name} plan?`}
      />

      {/* ✅ Confirm Cancel Modal */}
      <ConfirmationModal
        onConfirm={handleCancelSubscription}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel Elite Pro"
        description="Are you sure you want to cancel your Elite Pro subscription? This will affect your profile visibility."
      />

      {/* Confirm Change Subscription Modal */}
      <ConfirmationModal
        onConfirm={confirmChangeSubscription}
        open={changeConfirmOpen}
        onOpenChange={setChangeConfirmOpen}
        title={subscriptionAction === 'upgrade' ? 'Confirm Upgrade' : subscriptionAction === 'downgrade' ? 'Confirm Downgrade' : 'Confirm Change'}
        description={
          subscriptionAction === 'upgrade'
            ? `Are you sure you want to upgrade your plan to ${subscriptionPlan?.name}? Your new benefits will be available immediately.`
            : subscriptionAction === 'downgrade'
              ? `Are you sure you want to downgrade your plan to ${subscriptionPlan?.name}? Please note that this change will take effect immediately, and no refunds will be provided for the remaining period of your current plan.`
              : `Are you sure you want to change your plan to ${subscriptionPlan?.name}?`
        }
      />
    </div>
  );
};

export default EliteProSubscriptionPurchase;
