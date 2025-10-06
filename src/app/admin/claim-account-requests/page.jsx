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
import { useGetClaimsRequestsQuery } from '@/store/features/admin/generalApiService';
import countries from '@/data/countries';

export default function ClaimAccountRequests() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const limit = 10;

  const {
    data: claimsRequests,
    isLoading: isLoadingClaimsRequests,
    isFetching,
  } = useGetClaimsRequestsQuery({
    page,
    limit,
    search,
  });

  console.log('claimsRequests', claimsRequests);

  const countriesMap = React.useMemo(() => {
    const map = {};
    countries.forEach((country) => {
      map[country.countryId] = country.name;
    });
    return map;
  }, [countries]);

  const columns = [
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => {
        const country = row?.getValue('country');
        return <div className="">{country?.name}</div>;
      },
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
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const item = row.original;
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>
    //             <button
    //               onClick={() => handleEditLicenseModalOpen(item?._id)}
    //               className="flex gap-2"
    //             >
    //               <Pencil className="w-4 h-4" />
    //               Edit
    //             </button>
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>
    //             <div
    //               className="flex gap-2 cursor-pointer"
    //               onClick={() => setDeleteModalId(item?._id)}
    //             >
    //               <Trash2 className="w-4 h-4" /> Delete
    //             </div>
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
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
        data={claimsRequests?.data || []}
        pagination={
          claimsRequests?.pagination || { page: 1, limit: 10, total: 0 }
        }
        total={claimsRequests?.pagination?.total || 0}
        page={page}
        limit={limit}
        onPageChange={(page) => setPage(page)}
        onSearch={(val) => {
          setSearch(val);
          setPage(1); // reset to first page when searching
        }}
        isFetching={isFetching}
      />
    </>
  );
}
