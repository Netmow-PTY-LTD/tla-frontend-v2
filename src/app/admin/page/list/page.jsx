'use client';

import { DataTable } from '@/components/common/DataTable';
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
import { dummyPages } from '@/data/data';
import EditPageModal from '../_components/EditPageModal';
export default function ListOfPages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditPageModalOpen = (id) => {
    setIsEditModalOpen(true);
    setPageId(id);
  };

  const columns = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
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
                  onClick={() => handleDeleteCountry(item?._id)}
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
      <AddNewPageModal open={isModalOpen} setOpen={setIsModalOpen} />
      <EditPageModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        pageId={pageId}
      />
      <DataTable
        data={dummyPages || []}
        columns={columns}
        searchColumn={'name'}
      />
    </div>
  );
}
