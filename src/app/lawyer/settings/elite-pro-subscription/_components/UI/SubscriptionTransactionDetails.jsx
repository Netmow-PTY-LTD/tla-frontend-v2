'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Search, Download, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserTransactionHistoryQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import InvoiceModal from '../modal/InvoiceMoadal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceDocument from '@/components/dashboard/lawyer/invoice/InvoiceDocument';
import EliteProInvoiceDocument from '../module/InvoiceElitePro';

export const SubscriptionTransactionDetails = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const {
    data: transactionData,
    isError,
    isLoading,
  } = useUserTransactionHistoryQuery();



  useEffect(() => {
    if (!transactionData?.data) return;

    const term = searchTerm.toLowerCase();

    const filtered = transactionData.data
         .filter((transaction) => transaction.subscriptionType === 'elitePro') 
    .filter((transaction) => {
      const flatValues = [];

      Object.values(transaction).forEach((val) => {
        if (typeof val === 'object' && val !== null) {
          flatValues.push(...Object.values(val));
        } else {
          flatValues.push(val);
        }
      });

      return flatValues.some((value) => {
        if (!value) return false;
        return value.toString().toLowerCase().includes(term);
      });
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactionData?.data, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <>
      <div className="w-full max-w-[900px] mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Elite Pro Subscription Details
          </h1>
          <p className="text-gray-600">
            Track your Elite Pro subscription history and details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Elite Pro subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider text-left">
                    ID
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider text-left">
                    Plan
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider text-left">
                    Amount
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider text-left">
                    Status
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider text-left">
                    Date
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider text-left">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTransactions.map((tx) => {
                  return (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-mono text-gray-800">
                        {tx._id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        {tx?.subscriptionId?.eliteProPackageId?.name|| '-'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        ${tx.amountPaid}{' '}
                        <span className="text-gray-500">
                          ({tx.currency.toUpperCase()})
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            tx.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setOpen(true);
                            }}
                            className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                          >
                            view
                          </button>
                          <PDFDownloadLink
                            document={<EliteProInvoiceDocument transaction={tx} />}
                            fileName={`invoice_${tx._id}.pdf`}
                            className="px-4 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition"
                          >
                            {({ loading }) =>
                              loading ? 'Loading...' : 'Download'
                            }
                          </PDFDownloadLink>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {paginatedTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Elite Pro Subscriptions Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div>
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}{' '}
            of {filteredTransactions.length} Elite Pro subscriptions
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>
              Total Elite Pro subscriptions:{' '}
              <span className="font-semibold text-green-600">
                {filteredTransactions.length}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>

          {(() => {
            const pages = [];
            const maxVisiblePages = 5;
            const startPage =
              Math.floor((currentPage - 1) / maxVisiblePages) *
                maxVisiblePages +
              1;
            const endPage = Math.min(
              startPage + maxVisiblePages - 1,
              totalPages
            );

            if (startPage > 1) {
              pages.push(
                <Button
                  key="prev-ellipsis"
                  size="sm"
                  variant="outline"
                  disabled
                >
                  ...
                </Button>
              );
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <Button
                  key={i}
                  size="sm"
                  variant={currentPage === i ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </Button>
              );
            }

            if (endPage < totalPages) {
              pages.push(
                <Button
                  key="next-ellipsis"
                  size="sm"
                  variant="outline"
                  disabled
                >
                  ...
                </Button>
              );
            }

            return pages;
          })()}

          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
      <InvoiceModal
        open={open}
        setOpen={setOpen}
        transaction={selectedTransaction}
      />
    </>
  );
};
