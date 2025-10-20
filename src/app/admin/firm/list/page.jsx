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
import { Check, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import AddCountryModal from '../../_components/modal/AddCountryModal';
import EditCountryModal from '../../_components/modal/EditCountryModal';
import { useGetCompaniesListQuery } from '@/store/features/admin/generalApiService';
import { DataTableWithPagination } from '../../_components/DataTableWithPagination';
import {
  useGetAllFirmsQuery,
  useUpdateFirmStatusMutation,
} from '@/store/features/admin/firmsApiService';
import { data } from '@/data/data';

const companies = [
  {
    name: 'Lexoria Legal Consultants',
    email: 'contact@lexorialegal.com',
    registrationNumber: 'LAW-7823941',
    yearEstablished: 2010,
    phone: '+1-555-342-7890',
    website: 'https://www.lexorialegal.com',
    address: '120 Justice Avenue, Washington, DC, 20001, USA',
  },
  {
    name: 'Clause & Co. Attorneys',
    email: 'info@clauseco.com',
    registrationNumber: 'LAW-5592183',
    yearEstablished: 2005,
    phone: '+1-555-674-1123',
    website: 'https://www.clauseco.com',
    address: '85 Barrister Lane, Chicago, IL, 60601, USA',
  },
  {
    name: 'RegulaTech Solutions',
    email: 'support@regulatech.io',
    registrationNumber: 'LAW-8841230',
    yearEstablished: 2018,
    phone: '+1-555-998-4432',
    website: 'https://www.regulatech.io',
    address: '33 Compliance Blvd, San Francisco, CA, 94103, USA',
  },
  {
    name: 'JurisPath Advisors',
    email: 'contact@jurispath.com',
    registrationNumber: 'LAW-6623011',
    yearEstablished: 2013,
    phone: '+1-555-221-7654',
    website: 'https://www.jurispath.com',
    address: '47 Legal Row, Boston, MA, 02108, USA',
  },
  {
    name: 'EquiLaw Partners',
    email: 'hello@equilawpartners.com',
    registrationNumber: 'LAW-4410293',
    yearEstablished: 2016,
    phone: '+1-555-783-2098',
    website: 'https://www.equilawpartners.com',
    address: '59 Corporate Law St, New York, NY, 10005, USA',
  },
];

export default function Page() {
  const [addOpen, setAddOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const limit = 10;

  const { data: countryList, refetch, isFetching } = useGetCountryListQuery();
  const {
    data: firmsList,
    refetch: firmsRefetch,
    isFetching: isFirmsListFetching,
  } = useGetAllFirmsQuery({ page, limit, search });

  console.log('firmsList', firmsList);

  const [updateFirmStatus] = useUpdateFirmStatusMutation();

  const handleUpdateFirmStatus = async (firmId, status) => {
    const payload = { firmId, data: { status } };

    console.log('payload', payload);

    try {
      const res = await updateFirmStatus(payload).unwrap();
      if (res) {
        showSuccessToast(res?.message || 'Firm status updated successfully.');
        firmsRefetch();
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error?.message || 'Failed to update firm status.');
    }
  };

  const columns = [
    {
      accessorKey: 'firmName',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('firmName')}</div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => <div className="">{row.getValue('slug')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      accessorFn: (row) => row.contactInfo?.email,
      cell: ({ row }) => <div>{row.original.contactInfo?.email}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      accessorFn: (row) => row.contactInfo?.phone,
      cell: ({ row }) => <div>{row.original.contactInfo?.phone}</div>,
    },
    {
      accessorKey: 'zipcode',
      header: 'Address',
      accessorFn: (row) => row.contactInfo?.zipCode?.zipcode,
      cell: ({ row }) => <div className="">{row.getValue('zipcode')}</div>,
    },

    {
      accessorKey: 'officialWebsite',
      header: 'Website',
      accessorFn: (row) => row.contactInfo?.officialWebsite,
      cell: ({ row }) => (
        <div className="">{row.original.contactInfo?.officialWebsite}</div>
      ),
    },
    {
      accessorKey: 'yearEstablished',
      header: 'Year Established',
      cell: ({ row }) => (
        <div className="">{row.getValue('yearEstablished')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');

        let badgeClasses =
          'px-3 py-1 rounded-full text-xs font-semibold capitalize';
        let colorClasses = '';

        switch (status) {
          case 'approved':
            colorClasses = 'bg-green-100 text-green-800';
            break;
          case 'rejected':
            colorClasses = 'bg-red-100 text-red-800';
            break;
          case 'pending':
            colorClasses = 'bg-blue-100 text-blue-800';
            break;
          default:
            colorClasses = 'bg-gray-100 text-gray-800';
        }

        return (
          <div className={`${badgeClasses} ${colorClasses} inline-block`}>
            {status}
          </div>
        );
      },
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
                    handleUpdateFirmStatus(item?._id, 'approved');
                    setOpen(true);
                  }}
                  className="flex gap-2 w-full"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  className="flex gap-2 cursor-pointer w-full"
                  onClick={() => handleUpdateFirmStatus(item?._id, 'rejected')}
                >
                  <X className="w-4 h-4" /> Reject
                </button>
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
        <h2 className="text-2xl font-bold">Firms List</h2>
        {/* <Button onClick={() => setAddOpen(true)}>Add Company</Button> */}
      </div>
      {/* <AddCountryModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditCountryModal
        id={editId}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null); // reset after close
        }}
      /> */}

      <DataTableWithPagination
        data={firmsList?.data || []}
        columns={columns}
        page={page}
        limit={limit}
        onPageChange={(page) => setPage(page)}
        onSearch={(val) => {
          setSearch(val);
          setPage(1); // reset to first page when searching
        }}
        total={firmsList?.pagination?.total || 0}
        totalPage={firmsList?.pagination?.totalPage || 0}
        pagination={firmsList?.pagination}
        isFetching={isFirmsListFetching}
      />
    </>
  );
}
