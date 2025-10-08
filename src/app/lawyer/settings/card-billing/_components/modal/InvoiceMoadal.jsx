import { Modal } from '@/components/UIComponents/Modal';
import React from 'react';

const InvoiceModal = ({ open, setOpen, transaction }) => {
  if (!transaction) return null;

  const {
    createdAt,
    userId,
    creditPackageId,
    amountPaid,
    couponCode,
    discountApplied,
    currency,
  } = transaction;

  const total = amountPaid || 0;
  const discount = discountApplied || 0;
  const subTotal = total - (total * 10) / 110; // reverse-calculate 10% VAT from total
  const vat = total - subTotal;

  console.log('transaction', transaction);

  const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;

  return (
    <Modal width="max-w-[800px]" open={open} onOpenChange={setOpen}>
      <div className="p-2 text-gray-800 font-sans">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-base w-full md:w-1/2">
            <p>
              <b>{userId?.profile?.name}</b>
            </p>
            <p>
              {userId?.profile?.billingAddress
                ? `${userId.profile.billingAddress.addressLine1}, ${userId.profile.billingAddress.addressLine2}, ${userId.profile.billingAddress.city}, ${userId.profile.billingAddress.postcode}`
                : userId?.profile?.address?.replace(/,/g, ', ')}
            </p>

            <p className="">{userId?.companyName || userId?.email}</p>
            <div className="mt-10">
              <p className="font-semibold text-lg">
                Tax Invoice{' '}
                <strong>{transaction._id?.slice(-6).toUpperCase()}</strong>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right text-base text-gray-500">
            <div className="flex justify-end">
              <img
                src="/assets/img/logo.png"
                alt="The LawApp Logo"
                className="h-6 mb-2"
              />
            </div>
            <p>Suit 8/3, Level 3/54 Jephson ST</p>
            <p>Toowong, QLD 4066, Australia</p>
            <p>+61 490 135 339</p>
            {/* <p className="mt-2 font-medium text-black">ABN: 83 642 968 947</p> */}
            <div className="mt-4 bg-green-100 text-green-700 px-3 py-1 inline-block rounded-md text-sm font-semibold">
              ✓ PAID
            </div>
            <div className="mt-2 text-2xl text-green-600 font-bold">
              {formatCurrency(total)}
            </div>
            {/* <p className="text-sm text-gray-500">TOTAL INC. GST</p> */}
            {/* <p className="text-sm text-gray-500">TOTAL </p> */}
          </div>
        </div>

        {/* Table */}
        <div className="border-b border-gray-300 py-4">
          <div className="grid grid-cols-3 text-gray-600 font-medium mb-2 border-b border-gray-300 pb-2">
            <div>DETAILS</div>
            <div>PERIOD</div>
            <div className="text-right">PRICE</div>
          </div>
          <div className="grid grid-cols-3 mb-1">
            <div>Purchase of {creditPackageId?.credit} credits</div>
            <div>One-time Charge</div>
            <div className="text-right">
              {formatCurrency(creditPackageId?.price)}
            </div>
          </div>
          {couponCode && (
            <div className="grid grid-cols-3">
              <div>{`Discount from coupon (${couponCode})`}</div>
              <div>-</div>
              <div className="text-right text-red-500">
                - {formatCurrency(discount)}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-right space-y-1">
          {/* no remove this comment it will be use next time */}
          {/* <p>
                        Sub Total: <span className="ml-4 font-medium">{formatCurrency(subTotal)}</span>
                    </p>
                    <p>
                        VAT (10%): <span className="ml-4 font-medium">{formatCurrency(vat)}</span>
                    </p> */}
          <p className="font-semibold text-lg">
            {/* no remove this comment it will be use next time */}
            {/* Total inc. GST: <span className="ml-4 text-green-600 font-bold">{formatCurrency(total)}</span> */}
            Total :{' '}
            <span className="ml-4 text-green-600 font-bold">
              {formatCurrency(total)}
            </span>
          </p>
        </div>

        {/* Footer */}
        {/* <div className="mt-10 text-xs text-gray-500 text-center">
          <p>The LawApp Online</p>
          <p>ABN: 83 642 968 947</p>
          <p>
            Registered Office: Level 2, 11 York Street, Sydney, NSW 2000,
            Australia
          </p>
          <p>Registered in Australia (ACN: 642 968 947)</p>
          <p>
            Registered with the Australian Securities and Investments Commission
            (ASIC)
          </p>
        </div> */}
      </div>
    </Modal>
  );
};

export default InvoiceModal;
