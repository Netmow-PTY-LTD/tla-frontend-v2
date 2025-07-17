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
import AddCategoryModal from '../_components/AddCategoryModal ';
import EditCategoryModal from '../_components/EditCategoryModal';
import { useAllcategorysQuery, useDeletecategoryMutation } from '@/store/features/admin/categoryApiService';

export default function ServicesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const { data: categoryList, refetch } = useAllcategorysQuery();
  const [deleteCategory] = useDeletecategoryMutation();

  const handleDeleteCategory = async (id) => {
    try {
      const res = await deleteCategory(id).unwrap();
      if (res) {
        showSuccessToast(res?.message);
        refetch();
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to delete country.');
    }
  };
  const columns = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const imageUrl = row.getValue('image');
        return (
          <div className="flex justify-center items-center">
            <img
              src={imageUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
          </div>
        );
      },
    },

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
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleDeleteCategory(category?._id)}
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
      <div className="flex justify-between">
        <h1>Category List</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add New Category</Button>
      </div>
      <DataTable
        data={categoryList?.data || []}
        columns={columns}
        searchColumn={'name'}
      />
      <AddCategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditCategoryModal
        id={editId}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null); // reset after close
        }}
      />
    </div>
  );
}
