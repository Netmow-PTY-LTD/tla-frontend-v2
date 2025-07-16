
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

    const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;

    return (
        <Modal width="max-w-[800px]" open={open} onOpenChange={setOpen}>
            <div className="p-2 text-gray-800 font-sans">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <img src="/assets/img/logo.png" alt="The LawApp Logo" className="h-6 mb-2" />
                        <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
                        <h2 className="font-semibold text-lg mt-1">
                            Tax Invoice {transaction._id?.slice(-6).toUpperCase()}
                        </h2>
                        <p className="mt-2">{userId?.companyName || userId?.email}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <p>The LawApp Online</p>
                        <p>Level 9, 3 Sheldon Square</p>
                        <p>Sydney NSW 2000, Australia</p>
                        <p>+61 2 8294 6827</p>
                        <p className="mt-2 font-medium text-black">ABN: 83 642 968 947</p>
                        <div className="mt-4 bg-green-100 text-green-700 px-3 py-1 inline-block rounded-md text-sm font-semibold">
                            ✓ PAID
                        </div>
                        <div className="mt-2 text-2xl text-green-600 font-bold">{formatCurrency(total)}</div>
                        {/* <p className="text-sm text-gray-500">TOTAL INC. GST</p> */}
                        <p className="text-sm text-gray-500">TOTAL </p>
                    </div>
                </div>

                {/* Table */}
                <div className="border-t border-b border-gray-300 py-4">
                    <div className="grid grid-cols-3 text-gray-600 font-medium mb-2">
                        <div>DETAILS</div>
                        <div>PERIOD</div>
                        <div className="text-right">PRICE</div>
                    </div>
                    <div className="grid grid-cols-3 mb-1">
                        <div>Purchase of {creditPackageId?.credit} credits</div>
                        <div>One off charge</div>
                        <div className="text-right">{formatCurrency(creditPackageId?.price)}</div>
                    </div>
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
                        Total : <span className="ml-4 text-green-600 font-bold">{formatCurrency(total)}</span>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-10 text-xs text-gray-500 text-center">
                    <p>The LawApp Online</p>
                    <p>ABN: 83 642 968 947</p>
                    <p>Registered Office: Level 2, 11 York Street, Sydney, NSW 2000, Australia</p>
                    <p>Registered in Australia (ACN: 642 968 947)</p>
                    <p>Registered with the Australian Securities and Investments Commission (ASIC)</p>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
