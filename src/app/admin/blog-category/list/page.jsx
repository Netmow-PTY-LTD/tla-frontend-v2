'use client';
import { DataTable } from '@/components/common/DataTable';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import AddBlogCategoryModal from '../_components/AddBlogCategoryModal';
import EditBlogCategoryModal from '../_components/EditBlogCategoryModal';
import { useDeleteBlogCategoryMutation, useGetBlogCategoryListQuery } from '@/store/features/admin/blogApiService';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';

export default function Page() {
  const [addOpen, setAddOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);


  // For confirmation modal
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: categoryList, refetch, isFetching } = useGetBlogCategoryListQuery();

  const [categoryDelete] = useDeleteBlogCategoryMutation();

  const handleDeleteCategory = async () => {
  
    if (!deleteId) return;

    try {
      const res = await categoryDelete(deleteId).unwrap();
      if (res) {
        showSuccessToast(res?.message);
        refetch();
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to delete category.');
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.getValue('description')}</div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <div className={`${row.getValue('isActive') ? 'text-green-600' : 'text-red-600'}`}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;

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
                    setEditId(category?._id);
                    setOpen(true);
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
                  onClick={() => {
                    setDeleteId(category?._id);
                    setIsOpen(true);
                  }}
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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Blog Categories</h2>
        <Button onClick={() => setAddOpen(true)}>Add Category</Button>
      </div>
      <AddBlogCategoryModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditBlogCategoryModal
        id={editId}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
      />

      <DataTable
        data={categoryList?.data || []}
        columns={columns}
        searchColumn={'name'}
        isFetching={isFetching}
      />


      <ConfirmationModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        description="Are you sure you want to delete this blog category? This action cannot be undone."
      />

    </>
  );
}
