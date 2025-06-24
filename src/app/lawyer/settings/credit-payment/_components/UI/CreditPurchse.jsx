'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { BrandIcon } from '@/assets/icon';
import {
  useAddPaymentMethodMutation,
  useGetAllCreditPackagesQuery,
  useGetPaymentMethodQuery,
  usePurchaseCreditPackageMutation,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import AddCardModal from '../modal/AddCardModal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const CreditsPurchase = ({ creditPackage }) => {
  const [open, setOpen] = useState(false);
  const [autoTopUP, setAutoTopUp] = useState(false);
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const [purchasePackage] = usePurchaseCreditPackageMutation();
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
  const handlePurchase = async (creditPackageId, creditPrice) => {
    if (!card) {
      setOpen(true);
    } else {
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
    }
  };
  return (
    <div>
      <div className="border-0 bg-white rounded-lg shadow-sm pt-4 px-[17px] relative">
        <div className="bg-[#00C3C0] absolute text-white p-[10px] rounded-tl-md rounded-br-md text-sm font-medium top-0 left-0">
          20% OFF EXCLUSIVE STARTING PACK
        </div>

        <div className="mt-10">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="flex items-start space-x-4">
              <p className="font-medium text-gray-900">{creditPackage?.name}</p>
            </div>

            <div className="flex items-center space-x-2">
              <BrandIcon />
              <p className="font-medium text-gray-900">
                {creditPackage?.credit} Credits
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">
                $ {creditPackage?.priceDisplay}{' '}
                <span className="text-gray-500 text-sm font-normal">
                  (ex GST)
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                $ {creditPackage?.pricePerCredit}/credit
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Image
              src="/assets/img/Credits/guarantee.png"
              alt="Guarantee"
              width={160}
              height={160}
            />

            <div className="px-6 pb-6">
              <Button
                onClick={() =>
                  handlePurchase(creditPackage?._id, creditPackage?.price)
                }
                variant="primary"
                className="bg-[#12C7C4CC] hover:bg-teal-600 text-white px-8"
              >
                Buy Now
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

          <div className="w-full mt-6">
            <div className="w-[70%] mx-auto flex items-center space-x-2 bg-[#F9C01E33] rounded-t-md p-4">
              <Info className="h-5 w-5 text-[#00C3C0] flex-shrink-0" />
              <p className="text-sm text-gray-700">
                We'll give you your credits back if you don't secure at least
                one job on Bark using these credits.
              </p>
            </div>
          </div>
        </div>
      </div>
      <AddCardModal
        open={open}
        setOpen={setOpen}
        onCardAdded={handleCardAdded}
      />
    </div>
  );
};

export default CreditsPurchase;
