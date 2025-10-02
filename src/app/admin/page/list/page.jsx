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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import AddNewPageModal from '../_components/AddNewPageModal';
import EditPageModal from '../_components/EditPageModal';
import {
  useDeletePageMutation,
  useGetAllPagesQuery,
} from '@/store/features/admin/pagesApiService';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { showSuccessToast } from '@/components/common/toasts';
import { DataTableWithPagination } from '../../_components/DataTableWithPagination';
export default function ListOfPages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const LIMIT = 10;

  const handleEditPageModalOpen = (id) => {
    setIsEditModalOpen(true);
    setPageId(id);
  };

  const {
    data: pages,
    isLoading: isLoadingPages,
    refetch: refetchPages,
    isFetching,
  } = useGetAllPagesQuery({
    page,
    limit: LIMIT,
    search,
    sort: 'desc',
  });

  //console.log('pages', pages);

  const [deletePage] = useDeletePageMutation();

  const handleDeletePage = async (id) => {
    try {
      const res = await deletePage(id).unwrap();
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message || 'Page deleted successfully');
        setDeleteModalId(null);
        refetchPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      showErrorToast(error?.data?.message || 'Failed to delete page');
    }
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('title')}</div>
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div className="">{row.getValue('description')}</div>,
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
                    handleEditPageModalOpen(item?._id);
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
        <h2 className="text-2xl font-bold">List of Pages</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Page</Button>
      </div>
      {deleteModalId && (
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={() => setDeleteModalId(null)}
          onConfirm={() => handleDeletePage(deleteModalId)}
          title="Are you sure you want to delete this page?"
          description="This action cannot be undone. So please proceed with caution."
          cancelText="No"
        />
      )}
      <AddNewPageModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetchPages={refetchPages}
      />
      <EditPageModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        pageId={pageId}
        refetchPages={refetchPages}
      />
      <DataTableWithPagination
        data={pages?.data || []}
        columns={columns}
        searchColumn={'title'}
        pagination={pages?.pagination}
        page={page}
        limit={LIMIT}
        totalPage={pages?.pagination?.totalPage}
        total={pages?.pagination?.total}
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
