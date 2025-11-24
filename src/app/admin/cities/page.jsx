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
  useEditZipCodeMutation,
  useGetCountryListQuery,
  useGetZipCodeListQuery,
} from '@/store/features/public/publicApiService';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { ZipCodeDataTable } from '../zip-code/_components/ZipCodeTable';
import { SelectedZipCodeDataTable } from './_components/SelectedZipCodeDataTable';
import { useGetAllCitiesQuery } from '@/store/features/admin/citiesApiService';
import { ZipCodeDataTableWithChecked } from './_components/ZipCodeDataTable';

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedZipId, setSelectedZipId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchString, setSearchString] = useState('');
  const [cityPage, setCityPage] = useState(1);

  const LIMIT = 10;

  const cityLimit = 10;

  const { data: countryList, refetch: refetchCountry } =
    useGetCountryListQuery();

  useEffect(() => {
    if (countryList?.data?.length && !selectedCountry) {
      const aus = countryList.data.find(
        (c) => c.name.toLowerCase() === 'australia'
      );
      if (aus) {
        setSelectedCountry(aus._id);
      }
    }
  }, [countryList, selectedCountry]);

  const {
    data: ZipCodeList,
    isLoading: isZipCodeListLoading,
    isFetching,
  } = useGetZipCodeListQuery({
    page,
    limit: LIMIT,
    search,
    countryId: selectedCountry,
  });

  const handleCountryWiseServiceChange = (val) => {
    setSelectedCountry(val);
  };

  const {
    data: cityZipCodeList,
    isLoading: isCityZipCodeListLoading,
    isFetching: isCityZipCodeListFetching,
  } = useGetZipCodeListQuery({
    page: cityPage,
    limit: cityLimit,
    countryId: selectedCountry,
    isCity: true, // extra param to differentiate
  });

  const handleCheckedRow = async (selectedRows) => {
    // console.log('selectedRows', selectedRows);
    // You can do anything here: update parent state, call API, etc.
  };

  const [updateZipCode, { isLoading }] = useEditZipCodeMutation();

  const columns = (handleCheckedRow) => {
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);

              // Optional: call handleCheckedRow for all selected rows
              const selectedRows = table
                .getSelectedRowModel()
                .flatRows.map((r) => r.original);
              handleCheckedRow?.(selectedRows);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => {
          const item = row.original;

          const handleRowCheck = async (checked) => {
            row.toggleSelected(checked); // update selection state

            try {
              // Call API to update the row

              const res = await updateZipCode({
                _id: item._id,
                countryId: selectedCountry,
                isCity: checked,
              }).unwrap();

              // console.log('updateZipCode res', res);

              if (res?.success) {
                showSuccessToast('Zip code updated successfully.');

                // Pass updated row to parent if needed
                handleCheckedRow?.([res.data || { ...item, isCity: checked }]);
              }
            } catch (err) {
              console.error('Error updating status:', err);
              showErrorToast(
                err?.message || 'Failed to update zip code status'
              );
            }
          };

          return (
            <Checkbox
              checked={!!item.isCity}
              onCheckedChange={(value) => handleRowCheck(!!value)}
              aria-label="Select row"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'countryName',
        header: 'Country Name',
        cell: ({ row }) => {
          const item = row.original;
          const countryName =
            countryList?.data?.find((c) => c._id === item?.countryId?._id)
              ?.name || 'N/A';
          return <div>{countryName}</div>;
        },
      },
      {
        accessorKey: 'zipcode',
        header: 'Zip Code',
        cell: ({ row }) => <div>{row.getValue('zipcode')}</div>,
      },
      {
        accessorKey: 'postalCode',
        header: 'Post Code',
        cell: ({ row }) => <div>{row.getValue('postalCode')}</div>,
      },
    ];
  };

  const selectedColumns = [
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
          countryList?.data?.find((c) => c._id === item?.countryId?._id)
            ?.name || 'N/A';
        return <div>{countryName}</div>;
      },
    },
    {
      accessorKey: 'zipcode',
      header: 'Zip Code',
      cell: ({ row }) => <div>{row.getValue('zipcode')}</div>,
    },
    {
      accessorKey: 'postalCode',
      header: 'Post Code',
      cell: ({ row }) => <div>{row.getValue('postalCode')}</div>,
    },
  ];

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Cities</h2>
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
      </div>
      {/* <DataTable
        data={filteredZipCodes}
        columns={columns}
        searchColumn={'zipcode'}
      /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <SelectedZipCodeDataTable
          data={cityZipCodeList?.data || []}
          columns={selectedColumns}
          total={cityZipCodeList?.pagination?.total || 0}
          totalPage={cityZipCodeList?.pagination?.totalPage || 1}
          page={cityPage}
          onPageChange={setCityPage}
          limit={cityLimit}
          isFetching={isCityZipCodeListFetching}
          onSearch={(val) => {
            setSearchString(val);
            setCityPage(1); // reset to first page when searching
          }}
        />
        <ZipCodeDataTableWithChecked
          data={ZipCodeList?.data || []}
          columns={columns(handleCheckedRow)}
          totalPage={ZipCodeList?.pagination?.totalPage || 1}
          total={ZipCodeList?.pagination?.total || 0}
          page={page}
          onPageChange={setPage}
          limit={LIMIT}
          onSearch={(val) => {
            setSearch(val);
            setPage(1); // reset to first page when searching
          }}
          isFetching={isFetching}
          isZipCodeListLoading={isZipCodeListLoading}
        />
      </div>
    </div>
  );
}
