'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import Image from 'next/image';
import { BrandIcon } from '@/assets/icon';
import AddCardForm from './AddCardForm';
import {
  useAddPaymentMethodMutation,
  usePurchaseCreditPackageMutation,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { useState } from 'react';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

const CreditPurchaseLead = ({ recommendedPackage, onSuccess, onClose, needAddCard }) => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [autoTopUP, setAutoTopUp] = useState(false);
  const [pendingPackageId, setPendingPackageId] = useState(null);
  const [pendingPurchase, setPendingPurchase] = useState(false);
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const [purchaseCredits, { isLoading }] = usePurchaseCreditPackageMutation();

  const handleBuyClick = async () => {
    if (needAddCard) {
      // Save packageId to auto-purchase after card add
      setPendingPackageId(recommendedPackage?._id);
      setShowCardForm(true);
    } else {
      await handleBuy(recommendedPackage?._id);
    }
  };

  const handleCardAdded = async (paymentMethodId) => {
    try {
      const result = await addPaymentMethod({ paymentMethodId }).unwrap();
      if (result.success) {
        showSuccessToast(result?.message || 'Card added successfully');
        setShowCardForm(false);

        // Automatically buy credit after card add
        if (pendingPackageId) {
          await handleBuy(pendingPackageId);
        }
      } else {
        showErrorToast(result?.message || 'Failed to add card');
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Error adding card');
    }
  };

  const handleBuy = async (packageId) => {
    if (pendingPurchase) return;
    setPendingPurchase(true);

    try {
      const purchaseDetails = {
        packageId,
        autoTopUP,
        couponCode: null,
      };

      console.log('purchaseDetails', purchaseDetails)
      const result = await purchaseCredits(purchaseDetails).unwrap();
      if (result.success) {
        toast.success('Credits purchased successfully', { position: 'top-right' });
        onSuccess();
      } else {
        toast.error(result.message || 'Purchase failed', { position: 'top-right' });
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Payment failed', { position: 'top-right' });
    } finally {
      setPendingPurchase(false);
    }
  };




  if (showCardForm) {
    return <AddCardForm onCardAdded={handleCardAdded} />;
  }

  return (
    <div>
      <>
        <div className="border-0 bg-white rounded-lg shadow-sm pt-4 relative">
          <div className="bg-[#00C3C0] absolute text-white p-[10px] rounded-tl-md rounded-br-md text-sm font-medium top-0 left-0">
            20% OFF EXCLUSIVE STARTING PACK
          </div>

          <div className="mt-12">
            <div className="grid md:grid-cols-4 gap-6 items-start">
              <div className="flex items-start space-x-4">
                <p className="font-medium text-gray-900">
                  {recommendedPackage?.name}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <BrandIcon />
                <p className="font-medium text-gray-900">
                  {recommendedPackage?.credit} Credits
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-900">
                  $ {recommendedPackage?.priceDisplay}{' '}
                  <span className="text-gray-500 text-sm font-normal">
                    (ex GST)
                  </span>
                </p>
                <p className="text-gray-500 text-sm">
                  $ {recommendedPackage?.pricePerCredit}/credit
                </p>
              </div>
              <div className="">
                <Button
                  variant="primary"
                  disabled={isLoading}
                  className="bg-[#12C7C4CC] hover:bg-teal-600 text-white px-4"
                  onClick={handleBuyClick}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2" />
                      Purchasing...
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </Button>

                <div className="flex items-start space-x-2 mt-3">
                  <Checkbox
                    id="auto-topup"
                    checked={autoTopUP}
                    onCheckedChange={(checked) => setAutoTopUp(!!checked)}
                    className="mt-1 text-[#00C3C0]"
                  />
                  <label
                    htmlFor="auto-topup"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Auto top-up next time
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-full mt-6 ">
                <div className="flex items-center space-x-2 bg-[#f9f9fa] rounded-full">
                  <Image
                    src="/assets/img/Credits/guarantee.png"
                    alt="Guarantee"
                    width={80}
                    height={80}
                  />
                  {/* <Info className="h-5 w-5 text-[#00C3C0] flex-shrink-0" /> */}
                  <p className="text-sm text-gray-700">
                    We'll give you your credits back if you don't secure at
                    least one job on Bark using these credits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>


    </div>
  );
};

export default CreditPurchaseLead;
