'use client';
import { DataTable } from '@/components/common/DataTable';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
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
  useDeleteCountryMutation,
  useGetCountryListQuery,
} from '@/store/features/public/publicApiService';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import AddCountryModal from '../../_components/modal/AddCountryModal';
import EditCountryModal from '../../_components/modal/EditCountryModal';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';


export default function Page() {
  const [addOpen, setAddOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);


  const { data: countryList, refetch, isFetching } = useGetCountryListQuery();

  const [countryDelete] = useDeleteCountryMutation();

  const handleDeleteCountry = async (id) => {
    try {
      const res = await countryDelete(id).unwrap();
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
        <div className="uppercase">{row.getValue('slug')}</div>
      ),
    },
    {
      accessorKey: 'currency',
      header: 'Currency',
      cell: ({ row }) => (
        <div className="uppercase">{row.getValue('currency')}</div>
      ),
    },
    {
      accessorKey: 'taxPercentage',
      header: 'Tax %',
      cell: ({ row }) => <div>{row.getValue('taxPercentage')}%</div>,
    },
    {
      accessorKey: 'taxAmount',
      header: 'Tax Amount',
      cell: ({ row }) => <div>{row.getValue('taxAmount')}</div>,
    },
    {
      accessorKey: 'taxType',
      header: 'Tax Type',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('taxType') || '-'}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const country = row.original;

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
                {/* <Link
                  href={`/admin/country/edit/${country?._id}`}
                  className="flex gap-2 items-center"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link> */}
                <button
                  onClick={() => {
                    setEditId(country?._id);
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
                  onClick={() => setDeleteModalId(country?._id)}
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
        <h2 className="text-2xl font-bold">Country List Page</h2>
        <Button onClick={() => setAddOpen(true)}>Add Country</Button>
      </div>
      <AddCountryModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditCountryModal
        id={editId}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null); // reset after close
        }}
      />

      <DataTable
        data={countryList?.data || []}
        columns={columns}
        searchColumn={'name'}
        isFetching={isFetching}
      />
      {deleteModalId && (
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={() => setDeleteModalId(null)}
          onConfirm={() => handleDeleteCountry(deleteModalId)}
          title="Are you sure you want to delete this country?"
          description="This action cannot be undone. So please proceed with caution."
          cancelText="No"
        />
      )}
    </>

  );
}
