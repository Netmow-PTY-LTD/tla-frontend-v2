'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { userDummyImage } from '@/data/data';
import { formatRelativeTime } from '@/helpers/formatTime';
import { useGetAllRequestsFromClientQuery } from '@/store/features/public/publicApiService';
import Link from 'next/link';
import React from 'react';

export default function ClientRequests() {
  const { data: requestsFromClients, isLoading: isClientRequestsLoading } =
    useGetAllRequestsFromClientQuery();

  const requests = requestsFromClients?.data;
  //console.log('requests', requests);

  if (isClientRequestsLoading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        {/* Header section */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Content blocks */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Avatar skeleton */}
            <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
            {/* Text block */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}

        {/* Table or card-like block */}
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-1/3" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[1100px] mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Requests</h2>
        <div className="h-1 w-[20%] bg-[#00C3C0] mt-2 rounded"></div>
      </div>
      <div>
        {requests?.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg p-8 border border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              No Requests Yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You haven’t received any requests at the moment. Stay tuned — new
              requests will appear here.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        )}
        {requests?.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            {requests?.map((request, index) => (
              <div
                className={`flex items-start justify-between gap-4 py-3 px-4 rounded-lg border border-gray-200 ${
                  index === 0 && index === requests?.length - 1 ? '' : 'mb-4'
                }`}
                key={index}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        request?.leadId?.userProfileId?.profilePicture ||
                        userDummyImage
                      }
                      alt={request?.leadId?.userProfileId?.name || ''}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-gray-500 mb-1">
                      {request?.leadId?.userProfileId?.name}
                    </div>
                    <div className="text-sm text-black font-medium mb-1">
                      {request?.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      Status: <b>{request?.status}</b>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {request?.createdAt &&
                      formatRelativeTime(request?.createdAt)}
                  </span>
                  <Link
                    href={`/lawyer/dashboard/requests/${request?.leadId?._id}`}
                  >
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* {paginatedData?.length === 0 && <p>No notifications found.</p>}
        {paginatedData?.length > 0 && (
          <div className="flex justify-center gap-1 mt-10 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-80"
            >
              Prev
            </button>

            {pageNumbers.map((page, index) =>
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border border-gray-300 rounded ${
                    currentPage === page ? 'bg-black text-white' : ''
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-80"
            >
              Next
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
