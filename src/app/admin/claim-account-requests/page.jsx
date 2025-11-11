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
  Edit,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetClaimsRequestsQuery,
  useUpdateRequestStatusMutation,
} from '@/store/features/admin/generalApiService';
import countries from '@/data/countries';
import Link from 'next/link';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

export default function ClaimAccountRequests() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const limit = 10;

  const {
    data: claimsRequests,
    isLoading: isLoadingClaimsRequests,
    refetch: claimsRequestsRefetch,
    isFetching,
  } = useGetClaimsRequestsQuery({
    page,
    limit,
    search,
  });

  console.log('claimsRequests', claimsRequests);

  const [updateClaimRequestStatus] = useUpdateRequestStatusMutation();

  const handleUpdateClaimRequestStatus = async (id, status) => {
    const payload = {
      claimId: id,
      status,
      matchedLawFirmId: null,
      reviewerNote: 'Verified firm documents and approved claim.',
    };

    // console.log('payload', payload);

    try {
      const res = await updateClaimRequestStatus(payload).unwrap();
      // console.log('Status update response', res);
      if (res) {
        showSuccessToast(
          res?.message || 'Claim request status updated successfully.'
        );
        claimsRequestsRefetch();
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.message || 'Failed to update claim request status.'
      );
    }
  };

  const columns = [
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => {
        const country = row?.getValue('country');
        return <div className="">{country?.name}</div>;
      },
    },
    {
      accessorKey: 'lawFirmName',
      header: 'Company Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('lawFirmName')}</div>
      ),
    },
    {
      accessorKey: 'lawFirmEmail',
      header: 'Company Email',
      cell: ({ row }) => <div>{row.getValue('lawFirmEmail')}</div>,
    },
    {
      accessorKey: 'lawFirmRegistrationNumber',
      header: 'Registration Number',
      cell: ({ row }) => (
        <div className="uppercase">
          {row.getValue('lawFirmRegistrationNumber')}
        </div>
      ),
    },
    {
      accessorKey: 'claimerName',
      header: 'Claimer Name',
      cell: ({ row }) => <div className="">{row.getValue('claimerName')}</div>,
    },
    {
      accessorKey: 'claimerEmail',
      header: 'Claimer Email',
      cell: ({ row }) => <div className="">{row.getValue('claimerEmail')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');

        let badgeClasses =
          'px-3 py-1 rounded-full text-xs font-semibold capitalize';
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

        return (
          <div className={`${badgeClasses} ${colorClasses} inline-block`}>
            {status}
          </div>
        );
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
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/admin/claim-account-requests/${item?._id}`}
                  className="flex items-center gap-2 p-1"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={() => {
                    handleUpdateClaimRequestStatus(item?._id, 'approved');
                    // setOpen(true);
                  }}
                  className="flex gap-2 w-full p-1"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  className="flex gap-2 cursor-pointer w-full p-1"
                  onClick={() =>
                    handleUpdateClaimRequestStatus(item?._id, 'rejected')
                  }
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="">
        <h2 className="text-2xl font-bold mb-2">
          List of Claim Account Requests
        </h2>
      </div>
      <DataTableWithPagination
        columns={columns}
        data={claimsRequests?.data || []}
        pagination={
          claimsRequests?.pagination || { page: 1, limit: 10, total: 0 }
        }
        total={claimsRequests?.pagination?.total || 0}
        totalPage={claimsRequests?.pagination?.totalPage || 0}
        page={page}
        limit={limit}
        onPageChange={(page) => setPage(page)}
        onSearch={(val) => {
          setSearch(val);
          setPage(1); // reset to first page when searching
        }}
        isFetching={isFetching}
      />
    </>
  );
}
