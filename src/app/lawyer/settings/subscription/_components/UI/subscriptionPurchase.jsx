'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { BrandIcon } from '@/assets/icon';
import {
  useAddPaymentMethodMutation,

  useGetPaymentMethodQuery,
  usePurchaseCreditPackageMutation,
  useSetupSubscriptionMutation,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import AddCardModal from '../modal/AddCardModal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';

const SubscriptionPurchase = ({ subscriptionPlan }) => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const [subscriptionSubscription] = useSetupSubscriptionMutation();
  const { data, isError, isLoading } = useGetPaymentMethodQuery();

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

  const handleSubscription = async ({ subscriptionPackageId }) => {
    const subscriptionDetails = {
      subscriptionPackageId,
      autoRenew,
    };

    try {
      const result = await subscriptionSubscription(subscriptionDetails).unwrap();
      console.log('Purchase result:', result);
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




  return (
    <div>
      <div className="border-0 bg-white rounded-lg shadow-sm pt-4 pb-6 px-[17px] relative">
        {subscriptionPlan.discountPercentage > 0 && (
          <div className="bg-[#00C3C0] absolute text-white p-[10px] rounded-tl-md rounded-br-md text-sm font-medium top-0 left-0">
            <h2 className="text-sm font-medium text-white whitespace-nowrap">
              {subscriptionPlan.discountPercentage}% OFF {subscriptionPlan.name}
            </h2>
          </div>
        )}

        <div className="mt-12">
          <div className="grid md:grid-cols-4 gap-6 items-start">
            <div className="flex flex-col space-y-2">
              <p className="font-medium text-gray-900 text-lg">{subscriptionPlan?.name}</p>
              <p className="text-sm text-gray-600">{subscriptionPlan?.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <BrandIcon />
              <p className="font-medium text-gray-900 capitalize">
                {subscriptionPlan?.billingCycle}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900 text-lg">
                {subscriptionPlan?.priceFormatted}
              </p>
              <p className="text-gray-500 text-sm">
                {subscriptionPlan?.price?.currency} {subscriptionPlan?.price?.amount}/month
              </p>
            </div>

            <div className="">
              <Button
                variant="primary"
                className="bg-[#12C7C4CC] hover:bg-teal-600 text-white px-4"
                onClick={() => {
                  if (!card) {
                    setOpen(true);
                  } else {
                    setIsOpen(true);
                  }
                }}
              >
                Subscribe Now
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-gray-900 font-medium text-md mb-2">Features:</h3>
            <ul className="list-disc list-inside text-gray-700 text-sm">
              {subscriptionPlan?.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
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
                  Enjoy uninterrupted access to premium features with our subscription plans.
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
          handleSubscription({ subscriptionPackageId: subscriptionPlan?._id })
        }
        open={isOpen}
        onOpenChange={setIsOpen}
        description="Are you sure you want to subscribe to this plan?"
      />
    </div>
  );
};

export default SubscriptionPurchase;
