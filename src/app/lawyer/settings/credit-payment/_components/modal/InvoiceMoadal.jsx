import { Modal } from '@/components/UIComponents/Modal';
import React from 'react';

const InvoiceModal = ({ open, setOpen, }) => {
    return (
        <Modal width='max-w-[800px]' open={open} onOpenChange={setOpen}>
            <div className=" p-2   text-gray-800 font-sans">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <img src="/assets/img/logo.png" alt="The LawApp Logo" className="h-6 mb-2" />
                        <p className="text-sm text-gray-500">17/11/2024</p>
                        <h2 className="font-semibold text-lg mt-1">Tax Invoice 5248469</h2>
                        <p className="mt-2">James Noble Law</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <p>The LawApp Global Ltd</p>
                        <p>9th Floor, 3 Sheldon Square</p>
                        <p>London, W2 6HY</p>
                        <p>+44 20 8294 6827</p>
                        <p className="mt-2 font-medium text-black">ABN: 83 642 968 947</p>
                        <div className="mt-4 bg-green-100 text-green-700 px-3 py-1 inline-block rounded-md text-sm font-semibold">
                            ✓ PAID
                        </div>
                        <div className="mt-2 text-2xl text-green-600 font-bold">
                            $123.20
                        </div>
                        <p className="text-sm text-gray-500">TOTAL INC. GST</p>
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
                        <div>Purchase of 50 credits</div>
                        <div>One off charge</div>
                        <div className="text-right">$160.00</div>
                    </div>
                    <div className="grid grid-cols-3">
                        <div>30% off from coupon (ENG30OFF)</div>
                        <div>-</div>
                        <div className="text-right text-red-500">- $48.00</div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-4 text-right space-y-1">
                    <p>Sub Total: <span className="ml-4 font-medium">$112.00</span></p>
                    <p>VAT (10%): <span className="ml-4 font-medium">$11.20</span></p>
                    <p className="font-semibold text-lg">Total inc. GST: <span className="ml-4 text-green-600 font-bold">$123.20</span></p>
                </div>

                {/* Footer */}
                <div className="mt-10 text-xs text-gray-500 text-center">
                    <p>The LawApp Global Ltd</p>
                    <p>VAT number: 83642968947</p>
                    <p>Registered Office: 85 Great Portland Street, London, England, W1W 7LT, United Kingdom</p>
                    <p>Registered in England & Wales (registration number: 10614196)</p>
                    <p>Registered in Australia (ARBN: 642 968 947)</p>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
