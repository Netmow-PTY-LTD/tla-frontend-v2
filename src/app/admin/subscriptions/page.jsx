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
import AddSubscriptionModal from './_components/AddSubscriptionModal';
import EditSubscriptionModal from './_components/EditSubscriptionModal';
import {
  useDeleteSubscriptionMutation,
  useGetAllSubscriptionsQuery,
} from '@/store/features/admin/subcriptionsApiService';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { DataTableWithPagination } from '../_components/DataTableWithPagination';

export default function SubscriptionList() {
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
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    refetch: refetchSubscriptions,
    isFetching,
  } = useGetAllSubscriptionsQuery({
    page,
    limit: LIMIT,
    search,
  });

  console.log('subscriptions', subscriptions);
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const handleDeleteSubscription = async (id) => {
    try {
      // Call the delete subscription API
      const res = await deleteSubscription(id).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast('Subscription deleted successfully');
        refetchSubscriptions();
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      showErrorToast(error?.data?.message || 'Failed to delete subscription');
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
      id: 'price',
      header: 'Price',
      accessorFn: (row) => row.price?.amount ?? '',
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },

    {
      accessorKey: 'price.currency',
      header: 'Currency',
      accessorFn: (row) => row.price?.currency ?? '',
      cell: ({ getValue }) => <div>{getValue()}</div>,
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
        <h2 className="text-2xl font-bold">List of Subscriptions</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Subscription</Button>

        {deleteModalId && (
          <ConfirmationModal
            open={!!deleteModalId}
            onOpenChange={() => setDeleteModalId(null)}
            onConfirm={() => handleDeleteSubscription(deleteModalId)}
            title="Are you sure you want to delete this subscription?"
            description="This action cannot be undone. So please proceed with caution."
            cancelText="No"
          />
        )}
        <AddSubscriptionModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          refetchSubscriptions={refetchSubscriptions}
        />
        <EditSubscriptionModal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          subscriptionId={subscriptionId}
          refetchSubscriptions={refetchSubscriptions}
        />
      </div>
      <DataTableWithPagination
        columns={columns}
        data={subscriptions?.data || []}
        searchColumn={'name'}
        pagination={subscriptions?.pagination}
        page={page}
        limit={LIMIT}
        totalPage={subscriptions?.pagination?.totalPage}
        total={subscriptions?.pagination?.total}
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
