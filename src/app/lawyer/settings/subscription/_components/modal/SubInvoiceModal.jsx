import { Modal } from '@/components/UIComponents/Modal';
import React from 'react';

const SubInvoiceModal = ({ open, setOpen, transaction }) => {
  if (!transaction) return null;

  const {
    createdAt,
    userId,
    creditPackageId,
    subscriptionId,
    subscriptionType,
    amountPaid,
    couponCode,
    discountApplied,
    currency,
    invoice_pdf_url,
    transactionId,
    subtotal: subTotal,
    taxAmount,
    totalWithTax,
    taxRate,
    taxType,
  } = transaction;

  const formatCurrency = (amount) => {
    const symbol = currency?.toLowerCase() === 'usd' ? '$' : (currency?.toUpperCase() || '$');
    return `${symbol} ${(amount || 0).toFixed(2)}`;
  };

  // Calculate totals
  const total = totalWithTax || amountPaid || 0;
  const discount = discountApplied || 0;

  return (
    <Modal width="max-w-[800px]" open={open} onOpenChange={setOpen}>
      <div className="p-4 text-gray-800 font-sans">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="w-full md:w-1/2">
            <p>
              <b>{userId?.profile?.name || userId?.email}</b>
            </p>
            <p>
              {userId?.profile?.billingAddress
                ? `${userId.profile.billingAddress.addressLine1}, ${userId.profile.billingAddress.addressLine2}, ${userId.profile.billingAddress.city}, ${userId.profile.billingAddress.postcode}`
                : userId?.profile?.address?.replace(/,/g, ', ')}
            </p>
            <p>{userId?.companyName || userId?.email}</p>

            <div className="mt-6">
              <p className="font-semibold text-lg">
                Tax Invoice <strong>{transactionId || transaction?._id?.slice(-6).toUpperCase()}</strong>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="text-right text-base text-gray-500">
            <div className="flex justify-end">
              <img src="/assets/img/logo.png" alt="Logo" className="h-6 mb-2" />
            </div>
            <p>Suite 8/3, Level 3/54 Jephson ST</p>
            <p>Toowong, QLD 4066, Australia</p>
            <p>+61 490 135 339</p>

            <div className="mt-4 bg-green-100 text-green-700 px-3 py-1 inline-block rounded-md text-sm font-semibold">
              ✓ {transaction.status === 'completed' ? 'PAID' : 'PENDING'}
            </div>
            <div className="mt-2 text-2xl text-green-600 font-bold">{formatCurrency(total)}</div>
          </div>
        </div>

        {/* Table */}
        <div className="border-b border-gray-300 py-4">
          <div className="grid grid-cols-3 text-gray-600 font-medium mb-2 border-b border-gray-300 pb-2">
            <div>DETAILS</div>
            <div>PERIOD</div>
            <div className="text-right">PRICE</div>
          </div>

          {/* Credit purchase */}
          {creditPackageId && (
            <div className="grid grid-cols-3 mb-1">
              <div>{creditPackageId?.name} Package ({creditPackageId?.credit} credits)</div>
              <div>One-time Charge</div>
              <div className="text-right">{formatCurrency(creditPackageId?.price)}</div>
            </div>
          )}

          {/* Subscription */}
          {subscriptionType === 'subscription' && subscriptionId && subscriptionId?.subscriptionPackageId && (
            <div className="grid grid-cols-3 mb-1">
              <div>{subscriptionId.subscriptionPackageId.name}</div>
              <div>
                {new Date(subscriptionId.subscriptionPeriodStart).toLocaleDateString()} -{' '}
                {new Date(subscriptionId.subscriptionPeriodEnd).toLocaleDateString()}
              </div>
              <div className="text-right">
                {formatCurrency(subscriptionId.subscriptionPackageId.price?.amount || subTotal)}
              </div>
            </div>
          )}

          {/* Discount */}
          {couponCode && (
            <div className="grid grid-cols-3">
              <div>{`Discount from coupon (${couponCode})`}</div>
              <div>-</div>
              <div className="text-right text-red-500">- {formatCurrency(discount)}</div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-right space-y-1">
          <p className="text-gray-600">
            Sub Total: <span className="ml-4 font-medium">{formatCurrency(subTotal)}</span>
          </p>
          <p className="text-gray-600">
            {taxType || 'GST'} ({taxRate || 0}%): <span className="ml-4 font-medium">{formatCurrency(taxAmount)}</span>
          </p>
          <p className="font-semibold text-lg pt-2 border-t border-gray-200 inline-block w-full max-w-[250px] ml-auto">
            Total inc. {taxType || 'GST'}:{' '}
            <span className="ml-4 text-green-600 font-bold">{formatCurrency(total)}</span>
          </p>
        </div>

        {/* Invoice PDF */}
        {/* {invoice_pdf_url && (
          <div className="mt-4">
            <a
              href={invoice_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Invoice PDF
            </a>
          </div>
        )} */}
      </div>
    </Modal>
  );
};

export default SubInvoiceModal;
