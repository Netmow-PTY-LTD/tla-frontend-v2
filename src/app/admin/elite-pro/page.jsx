'use client';

import { Button } from '@/components/ui/button';
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
import {
  useDeleteEliteProSubscriptionMutation,
  useGetAllEliteProSubscriptionsQuery,
} from '@/store/features/admin/eliteProSubscriptionsApiService';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { DataTableWithPagination } from '../_components/DataTableWithPagination';

export default function EliteProSubscriptionsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const LIMIT = 10;

  const handleEditSubscriptionModalOpen = (id) => {
    setIsEditModalOpen(true);
    setSubscriptionId(id);
  };

  const {
    data: eliteProSubscriptions,
    isLoading: isLoadingEliteProSubscriptions,
    refetch: refetchEliteProSubscriptions,
    isFetching,
  } = useGetAllEliteProSubscriptionsQuery({
    page,
    limit: LIMIT,
  });

  console.log('eliteProSubscriptions', eliteProSubscriptions);

  const [deleteEliteProSubscription] = useDeleteEliteProSubscriptionMutation();
  const handleDeleteEliteProSubscription = async (id) => {
    try {
      // Call the delete subscription API
      const res = await deleteEliteProSubscription(id).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast('Elite Pro Subscription deleted successfully');
        refetchEliteProSubscriptions();
      }
    } catch (error) {
      console.error('Error deleting Elite Pro subscription:', error);
      showErrorToast(
        error?.data?.message || 'Failed to delete Elite Pro Subscription'
      );
    }
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
      accessorKey: 'price.amount',
      header: 'Price',
      cell: ({ row }) => {
        const price = row.original.price.amount;
        return <div className="">{price}</div>;
      },
    },
    {
      accessorKey: 'price.currency',
      header: 'Currency',
      cell: ({ row }) => {
        const currency = row.original.price.currency;
        return <div className="">{currency}</div>;
      },
    },

    {
      accessorKey: 'billingCycle',
      header: 'Billing Cycle',
      cell: ({ row }) => {
        const value = row.getValue('billingCycle');
        const labels = {
          monthly: 'Monthly',
          yearly: 'Yearly',
          weekly: 'Weekly',
          one_time: 'One Time',
        };

        return <div>{labels[value] || value}</div>;
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
                <button
                  onClick={() => {
                    handleEditSubscriptionModalOpen(item?._id);
                  }}
                  className="flex gap-2 w-full"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  className="flex gap-2 cursor-pointer w-full"
                  onClick={() => setDeleteModalId(item?._id)}
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
        {deleteModalId && (
          <ConfirmationModal
            open={!!deleteModalId}
            onOpenChange={() => setDeleteModalId(null)}
            onConfirm={() => handleDeleteEliteProSubscription(deleteModalId)}
            title="Are you sure you want to delete this subscription?"
            description="This action cannot be undone. So please proceed with caution."
            cancelText="No"
          />
        )}
        <AddEliteProSubscriptionModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          refetchEliteProSubscriptions={refetchEliteProSubscriptions}
        />
        <EditEliteProSubscriptionModal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          subscriptionId={subscriptionId}
          refetchEliteProSubscriptions={refetchEliteProSubscriptions}
        />
      </div>
      <DataTableWithPagination
        columns={columns}
        data={eliteProSubscriptions?.data || []}
        searchColumn={'name'}
        pagination={eliteProSubscriptions?.pagination}
        page={page}
        limit={LIMIT}
        totalPage={eliteProSubscriptions?.pagination?.totalPage}
        total={eliteProSubscriptions?.pagination?.total}
        onPageChange={setPage}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        isFetching={isFetching}
      />
    </div>
  );
}
