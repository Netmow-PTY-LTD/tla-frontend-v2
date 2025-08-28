'use client'
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

import { useChangeUserAccountStatsMutation, useUpdateUserDefalultPicMutation } from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import resizeAndConvertToWebP from '@/components/UIComponents/resizeAndConvertToWebP';
import { useAllClientDetailsQuery } from '@/store/features/admin/userApiService';
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

  const { data: userList, isFetching, refetch } = useAllClientDetailsQuery({
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
  const [changeAccoutStatus] = useChangeUserAccountStatsMutation();

  const handleChangeStatus = async (userId, status) => {
    try {
      const payload = {
        userId,
        data: { accountStatus: status },
      };

      const res = await changeAccoutStatus(payload).unwrap();

      if (res.success) {
        showSuccessToast(res?.message || 'Status Update Successful');
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

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
      id: 'profile.name',
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="capitalize">{row.original.name || 'N/A'}</div>,
    },
    {
      id: 'profile.profilePicture',
      accessorKey: 'profilePicture',
      header: 'Profile Picture',
      cell: ({ row }) => {
        const profile = row.original;
        const [uploadProfilePicture, { isLoading }] = useUpdateUserDefalultPicMutation();

        const handleUpload = async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const webpFile = await resizeAndConvertToWebP(file, 500, 0.8);

          const formData = new FormData();
          formData.append('file', webpFile);

          try {
            await uploadProfilePicture({ userId: profile._id, data: formData }).unwrap();
            refetch(); // Optional: refetch table after upload
          } catch (err) {
            console.error('Upload failed', err);
          }
        };

        return (
          <div className="flex items-center gap-2">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name || 'Profile'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <label className="px-2 py-1 bg-[#12C7C4] text-white text-xs rounded cursor-pointer hover:bg-[#0fa9a5]">
                Upload
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>
        );
      },
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
      <h1>All client Details </h1>
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

