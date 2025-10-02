'use client';

import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import certificationsAndLicenses from '@/data/certificationsAndLicenses';
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

export default function LicenseManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [licenseId, setLicenseId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

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
  } = useAllLawFirmCertificationsQuery(
    {
      countryId: selectedCountry,
      type: '',
      search: '',
      page: 1,
      limit: 50,
    },
    { skip: !selectedCountry }
  );

  console.log('licensesData', licensesData);

  const handleEditLicenseModalOpen = (id) => {
    setIsEditModalOpen(true);
    setLicenseId(id);
  };

  const [deleteLicense] = useDeleteLawFirmCertificationMutation();
  const handleDeleteLicense = async (id) => {
    try {
      const res = await deleteLicense(id).unwrap();
      console.log('res', res);
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
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div className="">{row.getValue('type')}</div>,
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
  // console.log('selectedCountry', selectedCountry);
  // console.log('filteredLicenses', filteredLicenses);

  console.log('deleteModalId', deleteModalId);

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
      <DataTable
        columns={columns}
        data={filteredLicenses || []}
        searchColumn={'certificationName'}
      />
    </>
  );
}
