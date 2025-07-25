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
import {
  useDeleteRangeMutation,
  useGetCountryListQuery,
  useGetRangeListQuery,
} from '@/store/features/public/publicApiService';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import CreateRangeModal from '../_components/CreateRangeModal';
import EditRangeModal from '../_components/EditRangeModal';

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);

  const { data: countryList, refetch: refetchCountry } =
    useGetCountryListQuery();

  const {
    data: allRanges,
    refetch: refetchRange,
    isFetching,
    isLoading,
  } = useGetRangeListQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteRange] = useDeleteRangeMutation();

  const handleDeleteRange = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this range?'
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteRange(id).unwrap();
      if (res) {
        showSuccessToast(res?.message);
        refetchRange();
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to delete range.');
    }
  };

  const handleModalSuccess = () => {
    console.log('Refetch or update list');
    // e.g. refetch zip codes
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
    // {
    //   id: 'countryName',
    //   header: 'Country Name',
    //   cell: ({ row }) => {
    //     const item = row.original;
    //     const countryName =
    //       countryList?.data?.find((c) => c._id === item.countryId)?.name ||
    //       'N/A';
    //     return <div>{countryName}</div>;
    //   },
    // },
    {
      accessorKey: 'name',
      header: 'Range',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'value',
      header: 'Range Value',
      cell: ({ row }) => <div>{row.getValue('value')}</div>,
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRange(item?._id);
                  setEditModalOpen(true);
                }}
                className="flex gap-2 cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={() => handleDeleteRange(item?._id)}
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-2xl">Ranges List</h2>

        {/* <div className="w-[300px]">
          <Select
            value={selectedCountry || ''}
            onValueChange={handleCountryWiseServiceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Show by Country" />
            </SelectTrigger>
            <SelectContent>
              {countryList?.data?.map((country) => (
                <SelectItem key={country?._id} value={country?._id}>
                  {country?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <Button onClick={() => setModalOpen(true)}>Add Range</Button>
        <CreateRangeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
        <EditRangeModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          rangeId={selectedRange}
          onSuccess={handleModalSuccess}
        />
      </div>
      <DataTable
        data={allRanges?.data || []}
        columns={columns}
        searchColumn="name"
      />
    </>
  );
}
