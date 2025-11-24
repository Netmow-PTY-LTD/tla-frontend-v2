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
import { Edit, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import AddLicenseModal from './_components/AddLicenseModal';
import EditLicenseModal from './_components/EditLicenseModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import countries from '@/data/countries';
import {
  useAllLawFirmCertificationsQuery,
  useDeleteLawFirmCertificationMutation,
} from '@/store/features/admin/lawFirmCertificationApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { DataTableWithPagination } from '../_components/DataTableWithPagination';

export default function LicenseManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [licenseId, setLicenseId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const limit = 10;

  const handleCountryWiseLicenseChange = (val) => {
    setSelectedCountry(val);
  };

  useEffect(() => {
    if (countries?.length > 0 && !selectedCountry) {
      const defaultCountry = countries.find(
        (c) => c.name.toLowerCase() === 'australia'
      );
      if (defaultCountry) {
        setSelectedCountry(defaultCountry.countryId);
      }
    }
  }, [countries, selectedCountry]);

  const {
    data: licensesData,
    isLoading: isLicenseDataLoading,
    refetch: refetchLicenseData,
    isFetching,
  } = useAllLawFirmCertificationsQuery(
    {
      countryId: selectedCountry,
      type: '',
      search,
      page,
      limit,
    },
    { skip: !selectedCountry }
  );

  const handleEditLicenseModalOpen = (id) => {
    setIsEditModalOpen(true);
    setLicenseId(id);
  };

  const [deleteLicense] = useDeleteLawFirmCertificationMutation();
  const handleDeleteLicense = async (id) => {
    try {
      const res = await deleteLicense(id).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'License deleted successfully');
        refetchLicenseData();
      }
    } catch (error) {
      console.log('error', error);
      showErrorToast(error?.data?.message || 'Failed to delete license');
    }
  };

  const columns = [
    {
      accessorKey: 'certificationName',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('certificationName')}</div>
      ),
    },
    {
      accessorKey: 'logo',
      header: 'Logo',
      cell: ({ row }) => {
        const logoUrl = row.getValue('logo'); // Assuming this is the logo URL or path

        return logoUrl ? (
          <img
            src={logoUrl}
            alt="Staff"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            N/A
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('type')}</div>
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
                    handleEditLicenseModalOpen(item?._id);
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

  const filteredLicenses = licensesData?.data?.filter(
    (item) => item.countryId === selectedCountry
  );

  return (
    <>
      <div className="mb-2">
        <h2 className="text-2xl font-bold mb-6">
          List of Licenses and Certifications
        </h2>
        <div className="flex justify-between mb-4">
          <div className="w-[300px]">
            <Select
              value={selectedCountry || ''}
              onValueChange={handleCountryWiseLicenseChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Show by Country" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((country) => (
                  <SelectItem
                    key={country?.countryId}
                    value={country?.countryId}
                  >
                    {country?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Add License</Button>
        </div>
      </div>

      {deleteModalId && (
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={() => setDeleteModalId(null)}
          onConfirm={() => handleDeleteLicense(deleteModalId)}
          title="Are you sure you want to delete this license?"
          description="This action cannot be undone. So please proceed with caution."
          cancelText="No"
        />
      )}
      <AddLicenseModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        refetchLicenseData={refetchLicenseData}
      />
      <EditLicenseModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        licenseId={licenseId}
        refetchLicenseData={refetchLicenseData}
      />
      <DataTableWithPagination
        columns={columns}
        data={filteredLicenses || []}
        pagination={licensesData?.pagination}
        page={page}
        limit={limit}
        totalPage={licensesData?.pagination?.totalPage}
        total={licensesData?.pagination?.total}
        onPageChange={setPage}
        onSearch={(val) => {
          setSearch(val);
          setPage(1); // reset to first page when searching
        }}
        isFetching={isFetching}
      />
    </>
  );
}
