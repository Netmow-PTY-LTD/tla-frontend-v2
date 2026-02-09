'use client';

import React from 'react';
import { DataTableWithPagination } from '../_components/DataTableWithPagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Check,
  Eye,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetLawyerProfileClaimsQuery,
  useUpdateLawyerProfileClaimStatusMutation,
} from '@/store/features/admin/lawyerProfileClaimService';
import Link from 'next/link';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

export default function LawyerProfileClaims() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const limit = 10;

  const {
    data: claimsRequests,
    isLoading: isLoadingClaimsRequests,
    refetch: claimsRequestsRefetch,
    isFetching,
  } = useGetLawyerProfileClaimsQuery({
    page,
    limit,
    search,
  });

  const [updateClaimStatus] = useUpdateLawyerProfileClaimStatusMutation();

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await updateClaimStatus({
        id,
        status,
        reviewerNote: `Manually ${status} by admin.`,
      }).unwrap();
      if (res) {
        showSuccessToast(res?.message || `Claim request ${status} successfully.`);
        claimsRequestsRefetch();
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error?.data?.message || `Failed to update claim request status.`);
    }
  };

  const columns = [
    {
      accessorKey: 'claimerName',
      header: 'Claimer Name',
      cell: ({ row }) => <div className="font-medium">{row.getValue('claimerName')}</div>,
    },
    {
      accessorKey: 'claimerEmail',
      header: 'Claimer Email',
      cell: ({ row }) => <div>{row.getValue('claimerEmail')}</div>,
    },
    {
      accessorKey: 'lawyerProfileEmail',
      header: 'Target Profile Email',
      cell: ({ row }) => <div>{row.getValue('lawyerProfileEmail')}</div>,
    },
    // {
    //   accessorKey: 'claimerPhone',
    //   header: 'Phone',
    //   cell: ({ row }) => <div>{row.getValue('claimerPhone')}</div>,
    // },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        let badgeClasses = 'px-3 py-1 rounded-full text-xs font-semibold capitalize';
        let colorClasses = '';

        switch (status) {
          case 'approved':
            colorClasses = 'bg-green-100 text-green-800';
            break;
          case 'rejected':
            colorClasses = 'bg-red-100 text-red-800';
            break;
          case 'pending':
            colorClasses = 'bg-blue-100 text-blue-800';
            break;
          default:
            colorClasses = 'bg-gray-100 text-gray-800';
        }

        return <div className={`${badgeClasses} ${colorClasses} inline-block`}>{status}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/lawyer-profile-claims/${item?._id}`}
                  className="flex items-center gap-2 cursor-pointer px-3 py-1"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {item.status === 'pending' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus(item?._id, 'approved')}
                    className="flex gap-2 cursor-pointer text-green-600 focus:text-green-600 px-3 py-1"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus(item?._id, 'rejected')}
                    className="flex gap-2 cursor-pointer text-red-600 focus:text-red-600 px-3 py-1"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Lawyer Profile Claim Requests</h2>
      </div>
      <DataTableWithPagination
        columns={columns}
        data={claimsRequests?.data || []}
        pagination={claimsRequests?.pagination || { page: 1, limit: 10, total: 0 }}
        total={claimsRequests?.pagination?.total || 0}
        totalPage={claimsRequests?.pagination?.totalPage || 0}
        page={page}
        limit={limit}
        onPageChange={(page) => setPage(page)}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        isFetching={isFetching}
      />
    </div>
  );
}
