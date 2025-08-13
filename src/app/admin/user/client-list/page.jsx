'use client';
import { DataTable } from '@/components/common/DataTable';
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

import { MoreHorizontal, Pencil, Trash2, View } from 'lucide-react';
import { useAllUsersQuery } from '@/store/features/admin/userApiService';
import React, { useState } from 'react';
import Link from 'next/link';
import { UserDetailsModal } from '../_components/UserDetailsModal';



export default function Page() {
  const { data: userList } = useAllUsersQuery();
  const [selectedUser, setSelectedUser] = useState(null); // state for selected lead
  const [open, setOpen] = useState(false);
   const clinetlist=userList?.data?.filter((client)=>client.regUserType==="client")

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
      accessorKey: 'profile.name',
      header: 'Name',
      cell: ({ row }) => {
        const profile = row.original.profile;
        return <div className="capitalize">{profile.name || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'regUserType',
      header: 'Type',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('regUserType')}</div>
      ),
    },
    {
      id: 'isVerifiedAccount',
      accessorKey: 'isVerifiedAccount',
      header: 'Email Verified',
      cell: ({ row }) => {
        const isVerifiedAccount = row.original?.isVerifiedAccount
        return (
          <div className="capitalize">
            {isVerifiedAccount ? "Verified Account" : "Not Verified"}
          </div>
        )
      },
    },
    {
      accessorKey: 'profile.phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.original?.profile.phone || '-'}</div>,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => (
        <div>{row.original?.profile.address || '-'}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const userId = user._id; // Make sure _id exists in your data

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
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/user/edit/${userId}`}
                  className="flex gap-2 items-center"
                >
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/user/delete/${userId}`}
                  className="flex gap-2 items-center"
                >
                  <Trash2 />
                  Delete
                </Link>
              </DropdownMenuItem>
              {/* Details Page */}
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user); // set current lead
                  setOpen(true); // open modal
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <View className="w-4 h-4" /> View
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];






  return (
    <div>
      <h1>Client List Page</h1>
      <DataTable
        data={clinetlist || []}
        columns={columns}
        searchColumn="profile.name"
      />
      <UserDetailsModal data={selectedUser} open={open}
        onOpenChange={setOpen} />
    </div>
  );
}
