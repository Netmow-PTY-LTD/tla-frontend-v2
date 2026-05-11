'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Pencil, Trash2, Power } from 'lucide-react';
import AddFaqModal from './_components/AddFaqModal';
import EditFaqModal from './_components/EditFaqModal';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { DataTableWithPagination } from '../_components/DataTableWithPagination';
import {
  useDeleteWebsiteFaqMutation,
  useGetAllWebsiteFaqsQuery,
  useToggleWebsiteFaqStatusMutation,
} from '@/store/features/admin/websiteFaqApiService';
import { Badge } from '@/components/ui/badge';

const FAQ_CATEGORY_LABELS = {
  client: 'Client',
  lawyer: 'Lawyer',
  general: 'General',
};

export default function WebsiteFaqManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [faqId, setFaqId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const limit = 10;

  const {
    data: faqsData,
    isLoading: isFaqDataLoading,
    refetch: refetchFaqData,
    isFetching,
  } = useGetAllWebsiteFaqsQuery({
    search,
    page,
    limit,
    category: categoryFilter,
  });

  const handleEditFaqModalOpen = (id) => {
    setIsEditModalOpen(true);
    setFaqId(id);
  };

  const [deleteFaq] = useDeleteWebsiteFaqMutation();
  const handleDeleteFaq = async (id) => {
    try {
      const res = await deleteFaq(id).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'FAQ deleted successfully');
        refetchFaqData();
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to delete FAQ');
    }
  };

  const [toggleStatus] = useToggleWebsiteFaqStatusMutation();
  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleStatus(id).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'Status updated successfully');
        refetchFaqData();
      }
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to update status');
    }
  };

  const columns = [
    {
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('question')}</div>
      ),
    },
    {
      accessorKey: 'answer',
      header: 'Answer',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 max-w-md line-clamp-2">
          {row.getValue('answer')}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.getValue('category');
        return (
          <Badge variant="outline" className="capitalize">
            {FAQ_CATEGORY_LABELS[category] || category}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive');
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'order',
      header: 'Order',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue('order')}</div>
      ),
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
                    handleEditFaqModalOpen(item?._id);
                  }}
                  className="flex gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleToggleStatus(item?._id)}
                  className="flex gap-2"
                >
                  <Power className="w-4 h-4" />
                  {item?.isActive ? 'Deactivate' : 'Activate'}
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
    <>
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Website FAQs</h2>
        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>Add FAQ</Button>
        </div>
      </div>

      {deleteModalId && (
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={() => setDeleteModalId(null)}
          onConfirm={() => handleDeleteFaq(deleteModalId)}
          title="Are you sure you want to delete this FAQ?"
          description="This action cannot be undone. So please proceed with caution."
          cancelText="No"
        />
      )}
      <AddFaqModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetchFaqData={refetchFaqData}
      />
      <EditFaqModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        faqId={faqId}
        refetchFaqData={refetchFaqData}
      />
      <DataTableWithPagination
        columns={columns}
        data={faqsData?.data || []}
        pagination={faqsData?.pagination}
        page={page}
        limit={limit}
        totalPage={faqsData?.pagination?.totalPage}
        total={faqsData?.pagination?.total}
        onPageChange={setPage}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        isFetching={isFetching}
      />
    </>
  );
}
