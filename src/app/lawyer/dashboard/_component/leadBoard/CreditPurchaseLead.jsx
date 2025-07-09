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
import AccordionComponent from '@/components/UIComponents/AcordionComponent';

const CreditPurchaseLead = ({
  recommendedPackage,
  onSuccess,
  onClose,
  needAddCard,
  lead
}) => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [autoTopUP, setAutoTopUp] = useState(false);
  const [pendingPackageId, setPendingPackageId] = useState(null);
  const [pendingPurchase, setPendingPurchase] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
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

      const result = await purchaseCredits(purchaseDetails).unwrap();
      if (result.success) {
        toast.success('Credits purchased successfully', {
          position: 'top-right',
        });
        onSuccess();
      } else {
        toast.error(result.message || 'Purchase failed', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Payment failed', {
        position: 'top-right',
      });
    } finally {
      setPendingPurchase(false);
    }
  };

  if (showCardForm) {
    return <AddCardForm onCardAdded={handleCardAdded} />;
  }

  return (


    <div className="space-y-6  bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className='text-center'>
        <h1 className="text-xl font-semibold text-gray-800">
          You need <span className="text-primary-600 font-bold"> {lead?.credit} credits</span> to contact <span className="font-bold">{lead?.userProfileId?.name} </span>
        </h1>
        <p className="text-gray-600 mt-2">
          To get some credits, you need to buy a <span className="font-medium text-primary-600">starter pack of credits</span>
          <br />
          (enough for this lead plus roughly another 9 leads).
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        <AccordionComponent
          content="Credits are The LawApp online currency. If you see a job that you like and you want to get in contact with that customer, then you use credits to purchase their contact details (you will receive their personal phone number and email address). The amount of credits required to contact a customer varies depending on the potential value of the job e.g. you will need less credits to contact a customer looking for a cleaner once a month for a 1 bedroomed flat than a customer looking for a cleaner once a week for a 5 bedroomed house."
          title="What are credits?"
          openValue={openAccordion}
          onChange={setOpenAccordion}
        />
        <AccordionComponent
          content="The starter pack is the only way to get started and trial The LawApp properly. It provides enough credits to contact roughly 10 customers and is designed so that you get hired at least once and get a great return on your investment. We’re so confident that you’ll get hired at least once from the starter pack that we offer a full Get Hired Guarantee. We also offer a massive 20% discount off the standard price."
          title="What is the starter pack?"
          openValue={openAccordion}
          onChange={setOpenAccordion}
        />
        <AccordionComponent
          content="The Get Hired Guarantee is there as we’re so confident that you’ll get hired at least once that if you don’t, we’ll return all of the credits so you can try again."
          title="What is the Get Hired Guarantee?"
          openValue={openAccordion}
          onChange={setOpenAccordion}
        />

      </div>

      {/* Offer Card */}
      <div className="relative  shadow-sm p-6 pt-10">
        {/* Ribbon Tag */}
        <div className="bg-[#00C3C0] absolute text-white px-3 py-1 text-sm font-semibold rounded-tl-md rounded-br-md top-0 left-[30%]">
          20% OFF EXCLUSIVE STARTING PACK
        </div>

        {/* Package Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-2 items-start">
          <div>
            <p className="text-lg font-medium text-gray-900">{recommendedPackage?.name}</p>
          </div>

          <div className="flex items-center space-x-2">
            <BrandIcon />
            <p className="text-gray-900 font-medium">{recommendedPackage?.credit} Credits</p>
          </div>

          <div>
            <p className="text-gray-900 font-medium">
              ${recommendedPackage?.priceDisplay}
              <span className="text-sm text-gray-500 font-normal"> (ex GST)</span>
            </p>
            <p className="text-sm text-gray-500">${recommendedPackage?.pricePerCredit}/credit</p>
          </div>

          <div>
            <Button
              variant="primary"
              disabled={isLoading}
              className="bg-[#12C7C4CC] hover:bg-teal-600 text-white px-4 w-full"
              onClick={handleBuyClick}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Purchasing...
                </>
              ) : (
                'Buy Now'
              )}
            </Button>

            {/* Auto Top-Up */}
            <div className="flex items-start mt-3 space-x-2">
              <Checkbox
                id="auto-topup"
                checked={autoTopUP}
                onCheckedChange={(checked) => setAutoTopUp(!!checked)}
                className="mt-1"
              />
              <label htmlFor="auto-topup" className="text-sm text-gray-700 cursor-pointer">
                Auto top-up next time
              </label>
            </div>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="mt-6 flex items-center space-x-4 bg-[#f9f9fa] rounded-full px-4 py-2">
          <Image
            src="/assets/img/Credits/guarantee.png"
            alt="Guarantee"
            width={60}
            height={60}
            className="flex-shrink-0"
          />
          <p className="text-sm text-gray-700">
            We'll give you your credits back if you don't secure at least one job on The LawApp using these credits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditPurchaseLead;
