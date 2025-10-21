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
import { Edit, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetClaimsRequestsQuery } from '@/store/features/admin/generalApiService';
import countries from '@/data/countries';
import Link from 'next/link';

export default function ClaimAccountRequests() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const limit = 10;

  const {
    data: claimsRequests,
    isLoading: isLoadingClaimsRequests,
    isFetching,
  } = useGetClaimsRequestsQuery({
    page,
    limit,
    search,
  });

  console.log('claimsRequests', claimsRequests);

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
                  className="flex items-center gap-2 p-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
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
