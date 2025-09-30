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

export default function LicenseManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [licenseId, setLicenseId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryWiseLicenseChange = (val) => {
    setSelectedCountry(val);
  };

  useEffect(() => {
    if (countries?.length > 0 && !selectedCountry) {
      const aus = countries.find((c) => c.name.toLowerCase() === 'australia');
      if (aus) {
        setSelectedCountry(aus._id);
      }
    }
  }, [countries, selectedCountry]);

  const handleEditLicenseModalOpen = (id) => {
    setIsEditModalOpen(true);
    setLicenseId(id);
  };

  const handleDeleteLicense = (id) => {
    alert(`Item with id ${id} has been deleted successfully.`);
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
                  onClick={() => handleDeleteLicense(item?._id)}
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

  const filteredLicenses = certificationsAndLicenses.filter(
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
      <AddLicenseModal open={isModalOpen} setOpen={setIsModalOpen} />
      <EditLicenseModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        licenseId={licenseId}
      />
      <DataTable
        columns={columns}
        data={filteredLicenses || []}
        searchColumn={'certificationName'}
      />
    </>
  );
}
