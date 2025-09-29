'use client';

import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { dummySubscriptions } from '@/data/data';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import AddEliteProSubscriptionModal from './_components/AddEliteProSubscriptionModal';
import EditEliteProSubscriptionModal from './_components/EditEliteProSubscriptionModal';

export default function EliteProList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);

  const handleEditSubscriptionModalOpen = (id) => {
    setIsEditModalOpen(true);
    setSubscriptionId(id);
  };

  const handleDeleteSubscription = (id) => {
    alert(`Item with id ${id} has been deleted successfully.`);
  };
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('slug')}</div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <div className="">{row.getValue('price')}</div>,
    },
    {
      accessorKey: 'currency',
      header: 'Currency',
      cell: ({ row }) => <div className="">{row.getValue('currency')}</div>,
    },
    {
      accessorKey: 'billingCycle',
      header: 'Billing Cycle',
      cell: ({ row }) => <div className="">{row.getValue('billingCycle')}</div>,
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
                <button
                  onClick={() => {
                    handleEditSubscriptionModalOpen(item?._id);
                  }}
                  className="flex gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() => handleDeleteSubscription(item?._id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">List of Elite Pro Subscriptions</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Elite Pro Subscription
        </Button>
        <AddEliteProSubscriptionModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
        />
        <EditEliteProSubscriptionModal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          subscriptionId={subscriptionId}
        />
      </div>
      <DataTable
        columns={columns}
        data={dummySubscriptions || []}
        searchColumn={'name'}
      />
    </div>
  );
}
