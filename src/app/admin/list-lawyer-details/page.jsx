'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Archive,
  CheckCircle,
  Circle,
  Clock,
  Eye,
  Loader,
  Loader2,
  MoreHorizontal,
  Pencil,
  Slash,
  Trash2,
  View,
} from 'lucide-react';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useChangeUserAccountStatsMutation, useUpdateUserDataMutation, useUpdateUserDefalultPicMutation } from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import resizeAndConvertToWebP from '@/components/UIComponents/resizeAndConvertToWebP';
import { useAllLawyerDetailsQuery, useAllUsersQuery } from '@/store/features/admin/userApiService';
import { UserDataTable } from '../user/_components/UserDataTable';
import { UserDetailsModal } from '../user/_components/UserDetailsModal';


// Enable relative time support
dayjs.extend(relativeTime);

export default function Page() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // state for selected lead

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);


  // Pagination & sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const { data: userList, isFetching, refetch } = useAllLawyerDetailsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [search]);


  console.log('check user list', userList)



  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="capitalize">{row.original.name || 'N/A'}</div>,
    },
    {
      id: 'totalResponses',
      accessorKey: 'totalResponses',
      header: 'Total Responses',
      cell: ({ row }) => <div>{row.original.totalResponses || 0}</div>,
    },
    {
      id: 'totalHired',
      accessorKey: 'totalHired',
      header: 'Total Hired',
      cell: ({ row }) => <div>{row.original.totalHired || 0}</div>,
    },
    {
      id: 'totalHireRequests',
      accessorKey: 'totalHireRequests',
      header: 'Total Hire Requests',
      cell: ({ row }) => <div>{row.original.totalHireRequests || 0}</div>,
    },
    {
      id: 'totalCreditsPurchased',
      accessorKey: 'totalCreditsPurchased',
      header: 'Total Credit Purchased',
      cell: ({ row }) => <div>{row.original.totalCreditsPurchased || 0}</div>,
    },
    {
      id: 'totalCreditsUsed',
      accessorKey: 'totalCreditsUsed',
      header: 'Total Credit Used',
      cell: ({ row }) => <div>{row.original.totalCreditsUsed || 0}</div>,
    },
    {
      id: 'availableCredits',
      accessorKey: 'availableCredits',
      header: 'Available Credits',
      cell: ({ row }) => <div>{row.original.availableCredits || 0}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              <DropdownMenuItem asChild>
                <Link href={`/admin/user/${user._id}`} className="flex gap-2 items-center">
                  <View className="w-4 h-4" /> View
                </Link>
              </DropdownMenuItem>



            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Lawyer List </h1>
      <UserDataTable
        data={userList?.data || []}
        columns={columns}
        searchColumn="profile.name"
        page={page}
        setPage={setPage}
        totalPages={userList?.pagination?.totalPage || 1}
        isFetching={isFetching}
        search={search}
        setSearch={setSearch}
      />

      <UserDetailsModal
        data={selectedUser}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

