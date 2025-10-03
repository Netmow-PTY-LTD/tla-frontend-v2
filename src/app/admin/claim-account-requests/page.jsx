'use client';
import React from 'react';
import { DataTableWithPagination } from '../_components/DataTableWithPagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { se } from 'date-fns/locale';

const dummyLawFirms = [
  {
    _id: '1',
    country: 'AU',
    lawFirmName: 'Sydney Legal Partners',
    lawFirmEmail: 'contact@sydneylegal.com',
    lawFirmRegistrationNumber: 'NSW-REG-45872',
    website: 'https://www.sydneylegal.com',
    knownAdminEmails: ['admin@sydneylegal.com', 'hr@sydneylegal.com'],
    claimerName: 'John Doe',
    claimerEmail: 'john.doe@sydneylegal.com',
  },
  {
    _id: '2',
    country: 'US',
    lawFirmName: 'New York Justice League',
    lawFirmEmail: 'info@nyjustice.com',
    lawFirmRegistrationNumber: 'NY-REG-99210',
    website: 'https://www.nyjustice.com',
    knownAdminEmails: ['admin@nyjustice.com', 'legal@nyjustice.com'],
    claimerName: 'John Doe',
    claimerEmail: 'john.doe@nyjustice.com',
  },
  {
    _id: '3',
    country: 'UK',
    lawFirmName: 'London Barristers Group',
    lawFirmEmail: 'contact@londonbarristers.co.uk',
    lawFirmRegistrationNumber: 'UK-REG-77441',
    website: 'https://www.londonbarristers.co.uk',
    knownAdminEmails: ['barristers@londonbarristers.co.uk'],
    claimerName: 'John Doe',
    claimerEmail: 'john.doe@londonbarristers.co.uk',
  },
  {
    _id: '4',
    country: 'CA',
    lawFirmName: 'Toronto Law Collective',
    lawFirmEmail: 'hello@torontolaw.ca',
    lawFirmRegistrationNumber: 'CA-REG-33456',
    website: 'https://www.torontolaw.ca',
    knownAdminEmails: ['admin@torontolaw.ca', 'contact@torontolaw.ca'],
    claimerName: 'John Doe',
    claimerEmail: 'john.doe@torontolaw.ca',
  },
  {
    _id: '5',
    country: 'IN',
    lawFirmName: 'Delhi Legal Chambers',
    lawFirmEmail: 'support@delhichambers.in',
    lawFirmRegistrationNumber: 'IN-REG-18372',
    website: 'https://www.delhichambers.in',
    knownAdminEmails: ['admin@delhichambers.in'],
    claimerName: 'John Doe',
    claimerEmail: 'john.doe@delhichambers.in',
  },
];

export default function ClaimAccountRequests() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const limit = 10;

  const columns = [
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
        <div className="uppercase">{row.getValue('country')}</div>
      ),
    },
    {
      accessorKey: 'lawFirmName',
      header: 'Company Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('lawFirmName')}</div>
      ),
    },
    {
      accessorKey: 'lawFirmEmail',
      header: 'Company Email',
      cell: ({ row }) => <div>{row.getValue('lawFirmEmail')}</div>,
    },
    {
      accessorKey: 'lawFirmRegistrationNumber',
      header: 'Registration Number',
      cell: ({ row }) => (
        <div className="uppercase">
          {row.getValue('lawFirmRegistrationNumber')}
        </div>
      ),
    },
    {
      accessorKey: 'knownAdminEmails',
      header: 'Known Admin Emails',
      cell: ({ row }) => {
        const emails = row.getValue('knownAdminEmails') || [];
        return (
          <div className="flex flex-col">
            {Array.isArray(emails) ? (
              emails.map((email, idx) => <span key={idx}>{email}</span>)
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'claimerName',
      header: 'Claimer Name',
      cell: ({ row }) => <div className="">{row.getValue('claimerName')}</div>,
    },
    {
      accessorKey: 'claimerEmail',
      header: 'Claimer Email',
      cell: ({ row }) => <div className="">{row.getValue('claimerEmail')}</div>,
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
                  onClick={() => handleEditLicenseModalOpen(item?._id)}
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

  return (
    <>
      <div className="">
        <h2 className="text-2xl font-bold mb-2">
          List of Claim Account Requests
        </h2>
      </div>
      <DataTableWithPagination
        columns={columns}
        data={dummyLawFirms || []}
        total={dummyLawFirms.length}
        page={page}
        limit={limit}
        onPageChange={(page) => setPage(page)}
        onSearch={(val) => {
          setSearch(val);
          setPage(1); // reset to first page when searching
        }}
      />
    </>
  );
}
