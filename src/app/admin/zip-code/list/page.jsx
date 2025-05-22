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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useDeleteZipCodeMutation,
  useGetCountryListQuery,
  useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import CreateZipCodeModal from '../../_components/modal/CreateZipCodeModal';
import EditZipCodeModal from '../../_components/modal/EditZipCodeModal';

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedZipId, setSelectedZipId] = useState(null);

  const { data: countryList, refetch: refetchCountry } =
    useGetCountryListQuery();
  const { data: ZipCodeList } = useGetZipCodeListQuery();

  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryWiseServiceChange = (val) => {
    setSelectedCountry(val);
  };

  const filteredZipCodes = useMemo(() => {
    if (!ZipCodeList?.data) return [];

    if (selectedCountry) {
      return ZipCodeList.data.filter(
        (zip) => zip.countryId === selectedCountry
      );
    }

    return ZipCodeList.data;
  }, [ZipCodeList, selectedCountry]);

  const [zipCodeDelete] = useDeleteZipCodeMutation();

  const handleDeleteZipCode = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this zip code?'
    );

    if (!confirmDelete) return;

    try {
      const res = await zipCodeDelete(id).unwrap();
      if (res) {
        showSuccessToast(res?.message);
        refetchCountry();
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to delete Zip Code.');
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
    {
      id: 'countryName',
      header: 'Country Name',
      cell: ({ row }) => {
        const item = row.original;
        const countryName =
          countryList?.data?.find((c) => c._id === item.countryId)?.name ||
          'N/A';
        return <div>{countryName}</div>;
      },
    },
    {
      accessorKey: 'zipcode',
      header: 'Zip Code',
      cell: ({ row }) => <div>{row.getValue('zipcode')}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        const countryName =
          countryList?.data?.find((c) => c._id === item.countryId)?.name ||
          'N/A';

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
                  setSelectedZipId(item?._id);
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
                  onClick={() => handleDeleteZipCode(item?._id)}
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
      <h1 className="font-bold text-lg mb-4">Zip Code List</h1>
      <div className="flex justify-between mb-4">
        <div className="w-[300px]">
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
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Zip Code</Button>
        <CreateZipCodeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
        <EditZipCodeModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          zipId={selectedZipId}
          onSuccess={handleModalSuccess}
        />
      </div>
      <DataTable
        data={filteredZipCodes}
        columns={columns}
        searchColumn={'zipcode'}
      />
    </div>
  );
}
